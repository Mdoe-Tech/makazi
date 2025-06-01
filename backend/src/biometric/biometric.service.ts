import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { BiometricRepository } from './biometric.repository';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';

@Injectable()
export class BiometricService {
  constructor(
    private readonly biometricRepository: BiometricRepository,
    private readonly loggingService: LoggingService
  ) {}

  async create(createBiometricDto: CreateBiometricDto) {
    this.loggingService.log('Creating new biometric record');
    return this.biometricRepository.create(createBiometricDto);
  }

  async findAll() {
    return this.biometricRepository.findAll();
  }

  async findOne(id: string) {
    const biometric = await this.biometricRepository.findOne(id);
    if (!biometric) {
      throw new NotFoundException(swMessages.biometric.not_found);
    }
    return biometric;
  }

  async findByCitizenId(citizenId: string) {
    return this.biometricRepository.findByCitizenId(citizenId);
  }

  async update(id: string, updateData: Record<string, any>) {
    return this.biometricRepository.update(id, updateData);
  }

  async updateBiometricData(id: string, biometricData: any) {
    return this.biometricRepository.updateBiometricData(id, biometricData);
  }

  async validateBiometric(id: string, qualityThreshold?: number) {
    const biometric = await this.findOne(id);
    // Add validation logic here
    return { isValid: true, quality: 0.95 };
  }

  async remove(id: string) {
    await this.biometricRepository.delete(id);
    this.loggingService.log(`Biometric record ${id} deleted`);
  }
} 