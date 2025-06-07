import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NidaRepository } from './nida.repository';
import { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './types';
import { Nida } from './entities/nida.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class NidaService {
  private readonly logger = new Logger(NidaService.name);

  constructor(private readonly nidaRepository: NidaRepository) {}

  async registerNida(data: Omit<NidaData, 'nida_number'>) {
    return this.nidaRepository.registerNida(data);
  }

  async getNidaData(filters: NidaFilters): Promise<{ data: NidaData[]; total: number }> {
    return this.nidaRepository.getNidaData(filters);
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    const { data } = await this.nidaRepository.getNidaDataById(id);
    if (!data) return { data: null };
    
    // Convert Date fields to ISO strings
    const formatted = { ...data } as any;
    if (formatted.date_of_birth) formatted.date_of_birth = formatted.date_of_birth.toISOString();
    if (formatted.father_date_of_birth) formatted.father_date_of_birth = formatted.father_date_of_birth.toISOString();
    if (formatted.mother_date_of_birth) formatted.mother_date_of_birth = formatted.mother_date_of_birth.toISOString();
    
    return { data: formatted as NidaData };
  }

  async verifyNida(data: VerifyNidaDto): Promise<{ data: NidaVerificationResult }> {
    return this.nidaRepository.verifyNida(data);
  }

  async getNidaVerificationHistory(id: string): Promise<{ data: NidaVerificationResult[] }> {
    const verifications = await this.nidaRepository.getNidaVerificationHistory(id);
    return {
      data: verifications.map(v => ({
        is_valid: v.is_valid,
        match_score: v.match_score,
        verification_date: v.verification_date.toISOString(),
        details: v.details
      }))
    };
  }

  async verifyNidaNumber(nidaNumber: string) {
    try {
      const nidaData = await this.nidaRepository.findOne({ nida_number: nidaNumber });
      
      if (!nidaData) {
        return {
          is_valid: false,
          message: 'NIDA number not found'
        };
      }

      return {
        is_valid: true,
        data: nidaData
      };
    } catch (error) {
      this.logger.error(`Error verifying NIDA number: ${error.message}`, error.stack);
      throw error;
    }
  }
} 