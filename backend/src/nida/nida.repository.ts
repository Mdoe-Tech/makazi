import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nida } from './entities/nida.entity';
import { NidaVerification } from './entities/nida-verification.entity';
import { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './types';

@Injectable()
export class NidaRepository {
  constructor(
    @InjectRepository(Nida)
    private readonly nidaRepository: Repository<Nida>,
    @InjectRepository(NidaVerification)
    private readonly verificationRepository: Repository<NidaVerification>
  ) {}

  private generateNidaNumber(): string {
    // Format: YYYY-XXXXXX where YYYY is current year and XXXXXX is a random 6-digit number
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `${year}-${random}`;
  }

  async registerNida(registerNidaDto: Omit<NidaData, 'nida_number'>): Promise<Nida> {
    let nidaNumber: string;
    let isUnique = false;

    // Keep generating until we get a unique NIDA number
    while (!isUnique) {
      nidaNumber = this.generateNidaNumber();
      const existing = await this.findByNidaNumber(nidaNumber);
      if (!existing) {
        isUnique = true;
      }
    }

    const nida = this.nidaRepository.create({
      ...registerNidaDto,
      nida_number: nidaNumber,
      biometric_data: JSON.stringify({
        status: 'PENDING',
        capture_date: null,
        fingerprint_data: null,
        facial_data: null,
        iris_data: null,
        signature_data: null
      }),
      metadata: {
        registration_source: 'MANUAL',
        registration_type: 'NEW',
        registration_status: 'PENDING',
        registration_date: new Date().toISOString(),
        registration_officer: registerNidaDto.registration_officer_name,
        registration_center: registerNidaDto.official_use_center_name
      },
      address: {
        street: registerNidaDto.current_residence_street,
        city: registerNidaDto.current_residence_district,
        region: registerNidaDto.current_residence_region,
        postal_code: registerNidaDto.current_residence_postal_code
      }
    });
    return this.nidaRepository.save(nida);
  }

  async findByNidaNumber(nidaNumber: string): Promise<Nida> {
    return this.nidaRepository.findOne({ where: { nida_number: nidaNumber } });
  }

  async findAll(): Promise<Nida[]> {
    return this.nidaRepository.find();
  }

  async update(nidaNumber: string, updateData: Partial<Nida>): Promise<Nida> {
    await this.nidaRepository.update(nidaNumber, updateData);
    return this.findByNidaNumber(nidaNumber);
  }

  async delete(nidaNumber: string): Promise<void> {
    await this.nidaRepository.delete(nidaNumber);
  }

  async getNidaData(filters: NidaFilters): Promise<{ data: NidaData[]; total: number }> {
    const { page = 1, limit = 10, ...whereFilters } = filters;
    const skip = (page - 1) * limit;

    const [data, total] = await this.nidaRepository.findAndCount({
      where: whereFilters,
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });
    return { data, total };
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    const data = await this.nidaRepository.findOne({ where: { nida_number: id } });
    console.log('NIDA Data from DB:', JSON.stringify(data, null, 2));
    return { data };
  }

  async verifyNida(data: VerifyNidaDto): Promise<{ data: NidaVerificationResult }> {
    const nida = await this.nidaRepository.findOne({
      where: { nida_number: data.nida_number }
    });

    if (!nida) {
      return {
        data: {
          is_valid: false,
          match_score: 0,
          verification_date: new Date().toISOString(),
          details: { reason: 'NIDA number not found' }
        }
      };
    }

    // Format dates to YYYY-MM-DD for comparison
    const formatDate = (date: string | Date) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return date.split('T')[0];
    };

    const nidaDate = formatDate(nida.date_of_birth);
    const verifyDate = formatDate(data.date_of_birth);

    // Compare provided data with stored NIDA record (case-insensitive)
    const mismatches = [];
    if (nida.first_name.toLowerCase() !== data.first_name.toLowerCase()) {
      mismatches.push('first_name');
    }
    if (nida.last_name.toLowerCase() !== data.last_name.toLowerCase()) {
      mismatches.push('last_name');
    }
    if (nidaDate !== verifyDate) {
      mismatches.push('date_of_birth');
    }
    if (nida.gender && data.gender && nida.gender.toLowerCase() !== data.gender.toLowerCase()) {
      mismatches.push('gender');
    }

    const is_valid = mismatches.length === 0;
    const match_score = is_valid ? 100 : 0;

    // Create verification record
    const verification = this.verificationRepository.create({
      nida_number: data.nida_number,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender || nida.gender, // Use provided gender or fallback to stored gender
      is_valid,
      match_score,
      details: {
        verified_fields: is_valid ? ['first_name', 'last_name', 'date_of_birth', 'gender'] : [],
        mismatches: mismatches
      }
    });
    await this.verificationRepository.save(verification);

    return {
      data: {
        is_valid,
        match_score,
        verification_date: verification.verification_date.toISOString(),
        details: verification.details
      }
    };
  }

  async getNidaVerificationHistory(id: string): Promise<{ data: NidaVerificationResult[] }> {
    const verifications = await this.verificationRepository.find({
      where: { nida_number: id },
      order: { verification_date: 'DESC' }
    });

    return {
      data: verifications.map(v => ({
        is_valid: v.is_valid,
        match_score: v.match_score,
        verification_date: v.verification_date.toISOString(),
        details: v.details
      }))
    };
  }
} 