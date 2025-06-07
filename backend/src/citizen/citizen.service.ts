import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { BiometricDataDto } from './dto/biometric.dto';
import { DocumentsDto } from './dto/documents.dto';
import { RegistrationStatus } from './enums/registration-status.enum';
import { RegistrationValidationService } from './services/registration-validation.service';
import { NotificationService } from '../notification/notification.service';
import { LoggingService } from '../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import * as swMessages from '../i18n/sw/sw.json';
import { CitizenRepository } from './citizen.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from './entities/citizen.entity';
import { NidaService } from '../nida/nida.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CitizenService {
  private readonly autoApproveEnabled: boolean;
  private readonly requireBiometricVerification: boolean;
  private readonly requireDocumentVerification: boolean;
  private readonly requireNidaVerification: boolean;

  constructor(
    @InjectRepository(Citizen)
    private citizenRepository: Repository<Citizen>,
    private readonly nidaService: NidaService,
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
    return this.citizenRepository.find();
  }

  async findOne(id: string) {
    const citizen = await this.citizenRepository.findOne({ where: { id } });
    if (!citizen) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }
    return citizen;
  }

  async findByNida(nidaNumber: string) {
    return this.citizenRepository.findOne({ where: { nida_number: nidaNumber } });
  }

  async findByNidaNumber(nidaNumber: string) {
    return this.citizenRepository.findOne({ where: { nida_number: nidaNumber } });
  }

  async create(createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    try {
      // Format dates if they exist
      if (createCitizenDto.date_of_birth) {
        createCitizenDto.date_of_birth = new Date(createCitizenDto.date_of_birth);
      }
      if (createCitizenDto.father_date_of_birth) {
        createCitizenDto.father_date_of_birth = new Date(createCitizenDto.father_date_of_birth);
      }
      if (createCitizenDto.mother_date_of_birth) {
        createCitizenDto.mother_date_of_birth = new Date(createCitizenDto.mother_date_of_birth);
      }

      // Verify NIDA number
      const nidaVerification = await this.nidaService.verifyNidaNumber(createCitizenDto.nida_number);
      
      if (!nidaVerification.is_valid) {
        throw new BadRequestException('Invalid NIDA number');
      }

      // Create citizen
      const citizen = this.citizenRepository.create({
        ...createCitizenDto,
        is_nida_verified: true,
        verification_data: nidaVerification
      });

      return await this.citizenRepository.save(citizen);
    } catch (error) {
      this.loggingService.error(`Error creating citizen: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    const citizen = await this.findOne(id);
    Object.assign(citizen, updateCitizenDto);
    return this.citizenRepository.save(citizen);
  }

  async remove(id: string) {
    const citizen = await this.findOne(id);
    return this.citizenRepository.remove(citizen);
  }

  async submitBiometricData(id: string, biometricData: BiometricDataDto) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status === RegistrationStatus.APPROVED || 
        citizen.registration_status === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.BIOMETRIC_VERIFICATION
    );

    const updatedCitizen = await this.citizenRepository.update(id, {
      biometric_data: {
        fingerprint: biometricData.fingerprint_data,
        facial_image: biometricData.facial_data,
        iris_scan: biometricData.iris_data,
        quality_score: biometricData.quality_score || 0
      }
    });

    await this.citizenRepository.update(id, {
      registration_status: RegistrationStatus.BIOMETRIC_VERIFICATION
    });
    
    await this.notificationService.sendStatusChangeNotification(
      citizen.id,
      citizen.registration_status,
      RegistrationStatus.BIOMETRIC_VERIFICATION,
      citizen.phone_number
    );

    return this.findOne(id);
  }

  async submitDocuments(id: string, documents: DocumentsDto) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status === RegistrationStatus.APPROVED || 
        citizen.registration_status === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.DOCUMENT_VERIFICATION
    );

    citizen.documents = documents;
    await this.citizenRepository.save(citizen);
    await this.citizenRepository.update(id, {
      registration_status: RegistrationStatus.DOCUMENT_VERIFICATION
    });
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      citizen.registration_status,
      RegistrationStatus.DOCUMENT_VERIFICATION,
      citizen.phone_number
    );

    return this.findOne(id);
  }

  async verifyNIDA(id: string, nidaNumber: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status === RegistrationStatus.APPROVED || 
        citizen.registration_status === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.NIDA_VERIFICATION
    );

    await this.citizenRepository.update(id, {
      nida_number: nidaNumber,
      registration_status: RegistrationStatus.NIDA_VERIFICATION
    });
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      citizen.registration_status,
      RegistrationStatus.NIDA_VERIFICATION,
      citizen.phone_number
    );

    return this.findOne(id);
  }

  async approveRegistration(id: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status === RegistrationStatus.APPROVED || 
        citizen.registration_status === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateApproval(citizen.registration_status);
    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.APPROVED
    );

    const oldStatus = citizen.registration_status;
    await this.citizenRepository.update(id, {
      registration_status: RegistrationStatus.APPROVED
    });
    
    await this.notificationService.sendStatusChangeNotification(
      id,
      oldStatus,
      RegistrationStatus.APPROVED,
      citizen.phone_number
    );

    return this.findOne(id);
  }

  async rejectRegistration(id: string, reason: string) {
    const citizen = await this.findOne(id);
    
    if (citizen.registration_status === RegistrationStatus.APPROVED || 
        citizen.registration_status === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_status);
    }

    this.validationService.validateRejection(citizen.registration_status, reason);
    this.validationService.validateStatusTransition(
      citizen.registration_status,
      RegistrationStatus.REJECTED
    );

    await this.citizenRepository.update(id, {
      rejection_reason: reason,
      registration_status: RegistrationStatus.REJECTED
    });
    
    await this.notificationService.sendRejectionNotification(
      id,
      citizen.phone_number,
      reason
    );

    return this.findOne(id);
  }

  async setPassword(nidaNumber: string, password: string) {
    this.loggingService.log(
      `Setting password for NIDA: ${nidaNumber}`,
      'Citizen'
    );
    
    const citizen = await this.findByNida(nidaNumber);
    if (!citizen) {
      this.loggingService.error(
        `Citizen not found for NIDA: ${nidaNumber}`,
        'Citizen'
      );
      throw new NotFoundException(`Citizen with NIDA number ${nidaNumber} not found`);
    }

    if (citizen.has_password) {
      this.loggingService.error(
        `Password already set for NIDA: ${nidaNumber}`,
        'Citizen'
      );
      throw new BadRequestException('Password already set for this citizen');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    citizen.password = hashedPassword;
    citizen.has_password = true;

    this.loggingService.log(
      `Successfully set password for NIDA: ${nidaNumber}`,
      'Citizen'
    );

    return this.citizenRepository.save(citizen);
  }

  async verifyPassword(citizen: Citizen, password: string) {
    if (!citizen.password) {
      return false;
    }
    return bcrypt.compare(password, citizen.password);
  }

  async verifyNidaNumber(nidaNumber: string) {
    this.loggingService.log(
      `Verifying NIDA number in service: ${nidaNumber}`,
      'Citizen'
    );
    const citizen = await this.citizenRepository.findOne({ where: { nida_number: nidaNumber } });
    this.loggingService.log(
      `NIDA verification result in service for ${nidaNumber}: exists=${!!citizen}, hasPassword=${citizen?.has_password || false}`,
      'Citizen'
    );
    return {
      exists: !!citizen,
      hasPassword: citizen?.has_password || false,
      citizen: citizen ? {
        id: citizen.id,
        first_name: citizen.first_name,
        last_name: citizen.last_name,
        nida_number: citizen.nida_number
      } : undefined
    };
  }

  async setInitialPassword(nidaNumber: string, password: string) {
    this.loggingService.log(
      `Setting initial password in service for NIDA: ${nidaNumber}`,
      'Citizen'
    );
    try {
      const citizen = await this.citizenRepository.findOne({ where: { nida_number: nidaNumber } });
      if (!citizen) {
        this.loggingService.error(
          `Citizen not found for NIDA: ${nidaNumber}`,
          'Citizen'
        );
        throw new NotFoundException(`Citizen with NIDA number ${nidaNumber} not found`);
      }

      if (citizen.has_password) {
        this.loggingService.error(
          `Password already set for NIDA: ${nidaNumber}`,
          'Citizen'
        );
        throw new BadRequestException('Password already set for this citizen');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.citizenRepository.update(
        { nida_number: nidaNumber },
        { 
          password: hashedPassword,
          has_password: true
        }
      );

      this.loggingService.log(
        `Successfully set initial password in service for NIDA: ${nidaNumber}`,
        'Citizen'
      );

      return { message: 'Password set successfully' };
    } catch (error) {
      this.loggingService.error(
        `Error setting initial password in service for NIDA: ${nidaNumber}: ${error.message}`,
        'Citizen'
      );
      throw error;
    }
  }
} 