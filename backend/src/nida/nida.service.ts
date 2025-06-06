import { Injectable } from '@nestjs/common';
import { NidaRepository } from './nida.repository';
import { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './types';

@Injectable()
export class NidaService {
  constructor(private readonly nidaRepository: NidaRepository) {}

  async registerNida(data: Omit<NidaData, 'nida_number'>): Promise<{ data: NidaData }> {
    const nida = await this.nidaRepository.registerNida(data);
    return { data: nida };
  }

  async getNidaData(filters: NidaFilters): Promise<{ data: NidaData[]; total: number }> {
    return this.nidaRepository.getNidaData(filters);
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    return this.nidaRepository.getNidaDataById(id);
  }

  async verifyNida(data: VerifyNidaDto): Promise<{ data: NidaVerificationResult }> {
    return this.nidaRepository.verifyNida(data);
  }

  async getNidaVerificationHistory(id: string): Promise<{ data: NidaVerificationResult[] }> {
    return this.nidaRepository.getNidaVerificationHistory(id);
  }
} 