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
      date_of_birth: new Date(registerNidaDto.date_of_birth).toISOString(),
      father_date_of_birth: registerNidaDto.father_date_of_birth ? new Date(registerNidaDto.father_date_of_birth).toISOString() : null,
      mother_date_of_birth: registerNidaDto.mother_date_of_birth ? new Date(registerNidaDto.mother_date_of_birth).toISOString() : null,
      application_date: new Date(registerNidaDto.application_date).toISOString(),
      verification_date: registerNidaDto.verification_date ? new Date(registerNidaDto.verification_date).toISOString() : null,
      registration_date: registerNidaDto.registration_date ? new Date(registerNidaDto.registration_date).toISOString() : new Date().toISOString(),
      expiry_date: registerNidaDto.expiry_date ? new Date(registerNidaDto.expiry_date).toISOString() : null,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      },
      // Set default values for optional fields
      email: registerNidaDto.email || null,
      place_of_birth: registerNidaDto.place_of_birth || null,
      mother_name: registerNidaDto.mother_name || null,
      father_name: registerNidaDto.father_name || null,
      blood_type: registerNidaDto.blood_type || null,
      religion: registerNidaDto.religion || null,
      education_level: registerNidaDto.education_level || null,
      disability_status: registerNidaDto.disability_status || null,
      disability_type: registerNidaDto.disability_type || null,
      emergency_contact_name: registerNidaDto.emergency_contact_name || null,
      emergency_contact_phone: registerNidaDto.emergency_contact_phone || null,
      emergency_contact_relationship: registerNidaDto.emergency_contact_relationship || null,
      photo_url: registerNidaDto.photo_url || null,
      signature_url: registerNidaDto.signature_url || null,
      fingerprint_url: registerNidaDto.fingerprint_url || null,
      document_url: registerNidaDto.document_url || null,
      verification_status: registerNidaDto.verification_status || null,
      verification_notes: registerNidaDto.verification_notes || null,
      last_updated_by: registerNidaDto.last_updated_by || null,
      status: registerNidaDto.status || 'ACTIVE',
      notes: registerNidaDto.notes || null
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
    const { page = 1, limit = 10, date_of_birth, ...whereFilters } = filters;
    const skip = (page - 1) * limit;

    const [data, total] = await this.nidaRepository.findAndCount({
      where: {
        ...whereFilters,
        ...(date_of_birth && { date_of_birth: new Date(date_of_birth) })
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    // Convert all date fields to ISO strings for NidaData interface
    const formattedData = data.map(item => {
      const formatted = { ...item } as any;
      
      // Convert Date fields to ISO strings
      if (formatted.date_of_birth) {
        formatted.date_of_birth = formatted.date_of_birth.toISOString();
      }
      if (formatted.application_date) {
        formatted.application_date = formatted.application_date.toISOString();
      }
      if (formatted.verification_date) {
        formatted.verification_date = formatted.verification_date.toISOString();
      }
      if (formatted.registration_date) {
        formatted.registration_date = formatted.registration_date.toISOString();
      }
      if (formatted.expiry_date) {
        formatted.expiry_date = formatted.expiry_date.toISOString();
      }
      if (formatted.last_updated) {
        formatted.last_updated = formatted.last_updated.toISOString();
      }
      if (formatted.created_at) {
        formatted.created_at = formatted.created_at.toISOString();
      }
      if (formatted.updated_at) {
        formatted.updated_at = formatted.updated_at.toISOString();
      }

      return formatted as NidaData;
    });

    return { data: formattedData, total };
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    const data = await this.nidaRepository.findOne({ where: { nida_number: id } });
    if (!data) return { data: null };
    
    // Convert all date fields to ISO strings
    const formatted = { ...data } as any;
    
    // Convert Date fields to ISO strings
    if (formatted.date_of_birth) formatted.date_of_birth = formatted.date_of_birth.toISOString();
    if (formatted.father_date_of_birth) formatted.father_date_of_birth = formatted.father_date_of_birth.toISOString();
    if (formatted.mother_date_of_birth) formatted.mother_date_of_birth = formatted.mother_date_of_birth.toISOString();
    if (formatted.application_date) formatted.application_date = formatted.application_date.toISOString();
    if (formatted.verification_date) formatted.verification_date = formatted.verification_date.toISOString();
    if (formatted.registration_date) formatted.registration_date = formatted.registration_date.toISOString();
    if (formatted.expiry_date) formatted.expiry_date = formatted.expiry_date.toISOString();
    if (formatted.last_updated) formatted.last_updated = formatted.last_updated.toISOString();
    if (formatted.created_at) formatted.created_at = formatted.created_at.toISOString();
    if (formatted.updated_at) formatted.updated_at = formatted.updated_at.toISOString();

    return { data: formatted as NidaData };
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