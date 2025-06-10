import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from './entities/citizen.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CitizensService {
  constructor(
    @InjectRepository(Citizen)
    private citizensRepository: Repository<Citizen>
  ) {}

  async findByNidaNumber(nidaNumber: string): Promise<Citizen | null> {
    return this.citizensRepository.findOne({
      where: { nida_number: nidaNumber }
    });
  }

  async create(registerDto: RegisterDto): Promise<Citizen> {
    const citizen = this.citizensRepository.create({
      ...registerDto,
      has_password: true,
      is_active: true
    });
    return this.citizensRepository.save(citizen);
  }

  async findById(id: string): Promise<Citizen | null> {
    return this.citizensRepository.findOne({
      where: { id }
    });
  }

  async verifyPassword(citizen: Citizen, password: string): Promise<boolean> {
    if (!citizen.password) return false;
    return bcrypt.compare(password, citizen.password);
  }
} 