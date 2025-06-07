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
    return this.nidaRepository.getNidaDataById(id);
  }

  async verifyNida(data: VerifyNidaDto): Promise<{ data: NidaVerificationResult }> {
    return this.nidaRepository.verifyNida(data);
  }

  async getNidaVerificationHistory(id: string): Promise<{ data: NidaVerificationResult[] }> {
    return this.nidaRepository.getNidaVerificationHistory(id);
  }
} 