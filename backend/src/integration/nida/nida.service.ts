import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nida } from './entities/nida.entity';
import { LoggingService } from '../../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import * as swMessages from '../../i18n/sw/sw.json';

@Injectable()
export class NidaService {
  private readonly nidaNumberFormat: string;
  private readonly nidaSequenceLength: number;
  private readonly nidaRandomLength: number;

  constructor(
    @InjectRepository(Nida)
    private nidaRepository: Repository<Nida>,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService
  ) {
    this.nidaNumberFormat = this.configService.get<string>('NIDA_NUMBER_FORMAT', 'YYYYMMDDSSSSRRRR');
    this.nidaSequenceLength = this.configService.get<number>('NIDA_SEQUENCE_LENGTH', 4);
    this.nidaRandomLength = this.configService.get<number>('NIDA_RANDOM_LENGTH', 4);
  }

  async registerCitizen(citizenData: any) {
    const nidaNumber = await this.generateNidaNumber(citizenData.date_of_birth);
    
    const citizen = this.nidaRepository.create({
      nida_number: nidaNumber,
      first_name: citizenData.first_name,
      middle_name: citizenData.middle_name,
      last_name: citizenData.last_name,
      date_of_birth: citizenData.date_of_birth,
      gender: citizenData.gender,
      nationality: citizenData.nationality,
      address: {
        street: citizenData.address?.street || '',
        city: citizenData.address?.city || '',
        region: citizenData.address?.region || '',
        postal_code: citizenData.address?.postal_code || ''
      },
      biometric_data: citizenData.biometric_data || {
        fingerprint: '',
        facial_image: '',
        iris_scan: ''
      },
      metadata: {
        registration_date: new Date(),
        last_updated: new Date(),
        status: 'active',
        verification_status: 'pending'
      }
    });

    await this.nidaRepository.save(citizen);
    this.loggingService.log(`Registered new citizen with NIDA number: ${nidaNumber}`);
    
    return {
      success: true,
      nida_number: nidaNumber,
      message: swMessages.integration.nida_verified
    };
  }

  async getCitizenData(nidaNumber: string) {
    const citizen = await this.nidaRepository.findOne({
      where: { nida_number: nidaNumber }
    });

    if (!citizen) {
      throw new NotFoundException(swMessages.integration.nida_invalid);
    }

    return {
      success: true,
      data: citizen
    };
  }

  async verifyCitizen(nidaNumber: string, citizenData: any) {
    const storedCitizen = await this.nidaRepository.findOne({
      where: { nida_number: nidaNumber }
    });

    if (!storedCitizen) {
      throw new NotFoundException(swMessages.integration.nida_invalid);
    }

    // Verify key fields match
    const verificationResult = {
      verified: true,
      mismatches: []
    };

    // Check personal info
    const personalFields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'nationality'];
    personalFields.forEach(field => {
      if (storedCitizen[field]?.toString() !== citizenData[field]?.toString()) {
        verificationResult.verified = false;
        verificationResult.mismatches.push(`personal_info.${field}`);
      }
    });

    // Check address
    if (storedCitizen.address.region !== citizenData.address?.region) {
      verificationResult.verified = false;
      verificationResult.mismatches.push('address');
    }

    this.loggingService.log(`Verified NIDA data for number: ${nidaNumber}, Result: ${verificationResult.verified}`);

    return {
      success: true,
      verified: verificationResult.verified,
      mismatches: verificationResult.mismatches,
      data: storedCitizen
    };
  }

  private async generateNidaNumber(dateOfBirth: Date): Promise<string> {
    const birthDate = new Date(dateOfBirth);
    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const day = String(birthDate.getDate()).padStart(2, '0');

    // Get the last registered number for this date to increment the sequence
    const lastCitizen = await this.nidaRepository
      .createQueryBuilder('citizen')
      .where('citizen.nida_number LIKE :prefix', { prefix: `${year}${month}${day}%` })
      .orderBy('citizen.nida_number', 'DESC')
      .getOne();

    let sequence = '0001';
    if (lastCitizen) {
      const lastSequence = parseInt(lastCitizen.nida_number.slice(-4));
      sequence = String(lastSequence + 1).padStart(4, '0');
    }

    // Format: YYYYMMDD + 4-digit sequence + 4-digit random number
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${year}${month}${day}${sequence}${random}`;
  }
} 