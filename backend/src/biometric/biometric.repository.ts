import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Biometric } from './entities/biometric.entity';

@Injectable()
export class BiometricRepository {
  constructor(
    @InjectRepository(Biometric)
    private readonly repository: Repository<Biometric>
  ) {}

  async findAll(): Promise<Biometric[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Biometric | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCitizenId(citizenId: string): Promise<Biometric[]> {
    return this.repository.find({
      where: {
        citizen_id: citizenId
      }
    });
  }

  async create(data: Partial<Biometric>): Promise<Biometric> {
    const biometric = this.repository.create(data);
    return this.repository.save(biometric);
  }

  async update(id: string, data: Partial<Biometric>): Promise<Biometric> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateBiometricData(id: string, biometricData: any): Promise<Biometric> {
    await this.repository.update(id, {
      biometric_data: biometricData,
      updated_at: new Date()
    });
    return this.findOne(id);
  }

  async findByType(type: string): Promise<Biometric[]> {
    return this.repository.find({
      where: {
        biometric_type: type
      }
    });
  }

  async findByQuality(qualityThreshold: number): Promise<Biometric[]> {
    return this.repository.find({
      where: {
        metadata: {
          quality_score: MoreThanOrEqual(qualityThreshold)
        }
      }
    });
  }
} 