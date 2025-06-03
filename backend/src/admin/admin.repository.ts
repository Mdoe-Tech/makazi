import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Admin | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(data: Partial<Admin>): Promise<Admin> {
    const admin = this.repository.create(data);
    return this.repository.save(admin);
  }

  async update(id: string, data: Partial<Admin>): Promise<Admin> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async updateLastLogin(id: string, ipAddress: string, userAgent: string): Promise<void> {
    await this.repository.update(id, {
      last_login: {
        timestamp: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 