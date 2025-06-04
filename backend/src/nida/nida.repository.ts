import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nida } from './entities/nida.entity';
import { NidaVerification } from './entities/nida-verification.entity';
import { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './dto/nida.types';
import { Citizen } from '../citizen/entities/citizen.entity';

@Injectable()
export class NidaRepository {
  constructor(
    @InjectRepository(Nida)
    private readonly nidaRepository: Repository<Nida>,
    @InjectRepository(NidaVerification)
    private readonly verificationRepository: Repository<NidaVerification>,
    @InjectRepository(Citizen)
    private readonly citizenRepository: Repository<Citizen>,
  ) {}

  private generateNidaNumber(): string {
    // Format: YYYY-XXXXXX-XXXXX
    // YYYY: Current year
    // XXXXXX: Random 6 digits
    // XXXXX: Random 5 digits
    const year = new Date().getFullYear();
    const random1 = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const random2 = Math.floor(10000 + Math.random() * 90000);   // 5 digits
    return `${year}-${random1}-${random2}`;
  }

  async registerNida(data: Omit<NidaData, 'nida_number'>, citizenId: string): Promise<{ data: NidaData }> {
    // Generate unique NIDA number
    let nidaNumber: string;
    let isUnique = false;
    
    while (!isUnique) {
      nidaNumber = this.generateNidaNumber();
      const existing = await this.nidaRepository.findOne({ 
        where: { nida_number: nidaNumber } 
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create NIDA record
    const nida = this.nidaRepository.create({
      ...data,
      nida_number: nidaNumber,
      is_verified: false,
    });
    await this.nidaRepository.save(nida);

    // Update citizen record with NIDA number
    await this.citizenRepository.update(citizenId, {
      nida_number: nidaNumber,
      is_nida_verified: false
    });

    return { data: nida };
  }

  async getNidaData(filters: NidaFilters): Promise<{ data: NidaData[]; total: number }> {
    const query = this.nidaRepository.createQueryBuilder('nida');
    
    if (filters.nida_number) {
      query.andWhere('nida.nida_number = :nida_number', { nida_number: filters.nida_number });
    }
    if (filters.first_name) {
      query.andWhere('nida.first_name ILIKE :first_name', { first_name: `%${filters.first_name}%` });
    }
    if (filters.last_name) {
      query.andWhere('nida.last_name ILIKE :last_name', { last_name: `%${filters.last_name}%` });
    }
    if (filters.date_of_birth) {
      query.andWhere('nida.date_of_birth = :date_of_birth', { date_of_birth: filters.date_of_birth });
    }
    if (filters.gender) {
      query.andWhere('nida.gender = :gender', { gender: filters.gender });
    }
    if (filters.is_verified !== undefined) {
      query.andWhere('nida.is_verified = :is_verified', { is_verified: filters.is_verified });
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    const data = await this.nidaRepository.findOne({ where: { nida_number: id } });
    return { data };
  }

  async verifyNida(data: VerifyNidaDto): Promise<{ data: NidaVerificationResult }> {
    const nida = await this.nidaRepository.findOne({ where: { nida_number: data.nida_number } });
    const is_valid = nida && 
      nida.first_name.toLowerCase() === data.first_name.toLowerCase() &&
      nida.last_name.toLowerCase() === data.last_name.toLowerCase() &&
      nida.date_of_birth === data.date_of_birth;

    const verification = this.verificationRepository.create({
      ...data,
      is_valid,
      match_score: is_valid ? 100 : 0,
      verification_date: new Date(),
    });
    await this.verificationRepository.save(verification);

    return {
      data: {
        is_valid,
        match_score: is_valid ? 100 : 0,
        verification_date: verification.verification_date.toISOString(),
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