import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { LoggingService } from '../logging/logging.service';
import * as bcrypt from 'bcrypt';
import * as swMessages from '../i18n/sw/sw.json';
import { Role } from '../auth/guards/roles.guard';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly loggingService: LoggingService
  ) {}

  async createFirstAdmin(createAdminDto: CreateAdminDto) {
    // Check if any admin exists
    const existingAdmin = await this.adminRepository.findAll();
    if (existingAdmin.length > 0) {
      throw new ConflictException('An admin user already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create the first admin with SUPER_ADMIN role
    const admin = await this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
      role: Role.SUPER_ADMIN
    });

    return admin;
  }

  async create(createAdminDto: CreateAdminDto) {
    this.loggingService.log('Creating new admin user');

    // Check if username or email already exists
    const existingAdmin = await Promise.all([
      this.adminRepository.findByUsername(createAdminDto.username),
      this.adminRepository.findByEmail(createAdminDto.email)
    ]);

    if (existingAdmin[0] || existingAdmin[1]) {
      throw new BadRequestException(swMessages.admin.username_or_email_exists);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword
    });

    return admin;
  }

  async findAll() {
    return this.adminRepository.findAll();
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne(id);
    if (!admin) {
      throw new NotFoundException(swMessages.admin.not_found);
    }
    return admin;
  }

  async findByUsername(username: string) {
    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) {
      throw new NotFoundException(swMessages.admin.not_found);
    }
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    // If updating username or email, check for duplicates
    if (updateAdminDto.username || updateAdminDto.email) {
      const existingAdmin = await Promise.all([
        updateAdminDto.username ? this.adminRepository.findByUsername(updateAdminDto.username) : null,
        updateAdminDto.email ? this.adminRepository.findByEmail(updateAdminDto.email) : null
      ]);

      if ((existingAdmin[0] && existingAdmin[0].id !== id) || 
          (existingAdmin[1] && existingAdmin[1].id !== id)) {
        throw new BadRequestException(swMessages.admin.username_or_email_exists);
      }
    }

    // If updating password, hash it
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    return this.adminRepository.update(id, updateAdminDto);
  }

  async remove(id: string) {
    await this.adminRepository.delete(id);
  }

  async updateLastLogin(id: string, ipAddress: string, userAgent: string) {
    await this.adminRepository.updateLastLogin(id, ipAddress, userAgent);
  }

  async toggleActive(id: string) {
    const admin = await this.findOne(id);
    return this.adminRepository.update(id, { is_active: !admin.is_active });
  }
} 