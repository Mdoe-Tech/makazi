import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig, ConfigCategory } from './entities/system-config.entity';

@Injectable()
export class SystemConfigRepository {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly repository: Repository<SystemConfig>
  ) {}

  async findAll(): Promise<SystemConfig[]> {
    return this.repository.find();
  }

  async findOne(key: string): Promise<SystemConfig | null> {
    return this.repository.findOne({ where: { key } });
  }

  async create(data: Partial<SystemConfig>): Promise<SystemConfig> {
    const config = this.repository.create(data);
    return this.repository.save(config);
  }

  async update(key: string, data: Partial<SystemConfig>): Promise<SystemConfig> {
    await this.repository.update({ key }, data);
    return this.findOne(key);
  }

  async findByCategory(category: ConfigCategory): Promise<SystemConfig[]> {
    return this.repository.find({
      where: { category }
    });
  }

  async toggleActive(key: string): Promise<SystemConfig> {
    const config = await this.findOne(key);
    if (!config) {
      throw new Error('Config not found');
    }
    config.is_active = !config.is_active;
    return this.repository.save(config);
  }

  async remove(key: string): Promise<void> {
    await this.repository.delete({ key });
  }
} 