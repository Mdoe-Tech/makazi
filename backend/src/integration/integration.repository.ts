import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationConfig } from './entities/integration-config.entity';

@Injectable()
export class IntegrationRepository {
  constructor(
    @InjectRepository(IntegrationConfig)
    private readonly repository: Repository<IntegrationConfig>
  ) {}

  async findAll(): Promise<IntegrationConfig[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<IntegrationConfig | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByType(type: string): Promise<IntegrationConfig | null> {
    return this.repository.findOne({
      where: {
        metadata: {
          provider: type
        }
      }
    });
  }

  async findByStatus(status: string): Promise<IntegrationConfig[]> {
    return this.repository.find({
      where: {
        metadata: {
          status: status
        }
      }
    });
  }

  async findActive(): Promise<IntegrationConfig[]> {
    return this.repository.find({
      where: {
        is_active: true
      }
    });
  }

  async create(data: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    const config = this.repository.create(data);
    return this.repository.save(config);
  }

  async update(id: string, data: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 