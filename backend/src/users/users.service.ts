import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Admin)
    private usersRepository: Repository<Admin>
  ) {}

  async findByUsername(username: string): Promise<Admin | null> {
    return this.usersRepository.findOne({
      where: { username }
    });
  }

  async findById(id: string): Promise<Admin | null> {
    return this.usersRepository.findOne({
      where: { id }
    });
  }
} 