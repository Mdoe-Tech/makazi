import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { BiometricDataDto } from './dto/biometric.dto';
import { DocumentsDto } from './dto/documents.dto';
import { RegistrationStatus } from './enums/registration-status.enum';
import { RegistrationValidationService } from './services/registration-validation.service';
import { NotificationService } from '../notification/notification.service';
import { LoggingService } from '../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import * as swMessages from '../i18n/sw/sw.json';
import { CitizenRepository } from './citizen.repository';

@Injectable()
export class CitizenService {
  private readonly autoApproveEnabled: boolean;
  private readonly requireBiometricVerification: boolean;
  private readonly requireDocumentVerification: boolean;
  private readonly requireNidaVerification: boolean;

  constructor(
    private readonly citizenRepository: CitizenRepository,
    private readonly validationService: RegistrationValidationService,
    private readonly notificationService: NotificationService,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService
  ) {
    this.autoApproveEnabled = this.configService.get<boolean>('REGISTRATION_AUTO_APPROVE', false);
    this.requireBiometricVerification = this.configService.get<boolean>('REQUIRE_BIOMETRIC_VERIFICATION', true);
    this.requireDocumentVerification = this.configService.get<boolean>('REQUIRE_DOCUMENT_VERIFICATION', true);
    this.requireNidaVerification = this.configService.get<boolean>('REQUIRE_NIDA_VERIFICATION', true);
  }

  async findAll() {
    return this.citizenRepository.findAll();
  }

  async findOne(id: string) {
    const citizen = await this.citizenRepository.findOne(id);
    if (!citizen) {
      throw new NotFoundException(swMessages.citizen.not_found);
    }
    return citizen;
  }

  async create(createCitizenDto: CreateCitizenDto) {
    const citizen = await this.citizenRepository.create({
      ...createCitizenDto,
      registration_status: RegistrationStatus.PENDING,
      address: {
        street: createCitizenDto.address,
        city: '',
        region: '',
        postal_code: ''
      }
    });
    return citizen;
  }

  async update(id: string, createCitizenDto: CreateCitizenDto) {
    const citizen = await this.findOne(id);
    const updateData = {
      ...createCitizenDto,
      address: {
        street: createCitizenDto.address,
        city: citizen.address.city,
        region: citizen.address.region,
        postal_code: citizen.address.postal_code
      }
    };
    return this.citizenRepository.update(id, updateData);
  }

  async remove(id: string) {
    await this.citizenRepository.delete(id);
  }

  async submitBiometricData(id: string, biometricData: BiometricDataDto) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status !== RegistrationStatus.PENDING &&
        citizen.registration_status !== RegistrationStatus.BIOMETRIC_VERIFICATION) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.BIOMETRIC_VERIFICATION
    );

    const updatedCitizen = await this.citizenRepository.updateBiometricData(id, {
      fingerprint: biometricData.fingerprint_data,
      facial_image: biometricData.facial_data,
      iris_scan: biometricData.iris_data,
      quality_score: biometricData.quality_score || 0
    });

    await this.citizenRepository.updateRegistrationStatus(
      id,
      RegistrationStatus.BIOMETRIC_VERIFICATION
    );
    
    await this.notificationService.sendStatusChangeNotification(
      citizen.id,
      RegistrationStatus.PENDING,
      RegistrationStatus.BIOMETRIC_VERIFICATION,
      citizen.phone_number
    );

    return updatedCitizen;
  }

  async submitDocuments(id: string, documents: DocumentsDto) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status !== RegistrationStatus.PENDING &&
        citizen.registration_status !== RegistrationStatus.BIOMETRIC_VERIFICATION) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.DOCUMENT_VERIFICATION
    );

    const updatedCitizen = await this.citizenRepository.updateDocuments(id, documents);
    await this.citizenRepository.updateRegistrationStatus(
      id,
      RegistrationStatus.DOCUMENT_VERIFICATION
    );
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      RegistrationStatus.BIOMETRIC_VERIFICATION,
      RegistrationStatus.DOCUMENT_VERIFICATION,
      citizen.phone_number
    );

    return updatedCitizen;
  }

  async verifyNIDA(id: string, nidaNumber: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status !== RegistrationStatus.DOCUMENT_VERIFICATION) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.NIDA_VERIFICATION
    );

    const updatedCitizen = await this.citizenRepository.update(id, {
      nida_number: nidaNumber
    });

    await this.citizenRepository.updateRegistrationStatus(
      id,
      RegistrationStatus.NIDA_VERIFICATION
    );
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      RegistrationStatus.DOCUMENT_VERIFICATION,
      RegistrationStatus.NIDA_VERIFICATION,
      citizen.phone_number
    );

    return updatedCitizen;
  }

  async approveRegistration(id: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status !== RegistrationStatus.NIDA_VERIFICATION) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateApproval(citizen.registration_status);
    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.APPROVED
    );

    const oldStatus = citizen.registration_status;
    const updatedCitizen = await this.citizenRepository.updateRegistrationStatus(
      id,
      RegistrationStatus.APPROVED
    );
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      oldStatus,
      RegistrationStatus.APPROVED,
      citizen.phone_number
    );

    return updatedCitizen;
  }

  async rejectRegistration(id: string, reason: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status !== RegistrationStatus.NIDA_VERIFICATION) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateRejection(citizen.registration_status, reason);
    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.REJECTED
    );

    const updatedCitizen = await this.citizenRepository.update(id, {
      rejection_reason: reason
    });

    await this.citizenRepository.updateRegistrationStatus(
      id,
      RegistrationStatus.REJECTED
    );
    
    await this.notificationService.sendRejectionNotification(
      id,
      citizen.phone_number,
      reason
    );

    return updatedCitizen;
  }
} 