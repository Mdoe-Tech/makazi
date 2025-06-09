import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { LoggingService } from '../logging/logging.service';
import * as bcrypt from 'bcrypt';
import * as swMessages from '../i18n/sw/sw.json';
import { Role } from '../auth/enums/role.enum';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly loggingService: LoggingService
  ) {}

  async createFirstAdmin(createAdminDto: CreateAdminDto) {
    this.loggingService.log('Checking if any admin exists');
    // Check if any admin exists
    const existingAdmin = await this.adminRepository.findAll();
    if (existingAdmin.length > 0) {
      this.loggingService.warn('Attempted to create first admin when admin already exists');
      throw new ConflictException('An admin user already exists');
    }

    this.loggingService.log('Hashing password for first admin');
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    this.loggingService.log('Creating first admin with SUPER_ADMIN role');
    // Create the first admin with SUPER_ADMIN role
    const admin = await this.adminRepository.create({
      username: createAdminDto.username,
      password: hashedPassword,
      first_name: createAdminDto.first_name,
      last_name: createAdminDto.last_name,
      email: createAdminDto.email,
      functional_roles: [Role.SUPER_ADMIN]
    });

    this.loggingService.log(`First admin created successfully with ID: ${admin.id}`);
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
      password: hashedPassword,
      roles: createAdminDto.roles || createAdminDto.functional_roles
    });

    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Hash password if provided
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    return this.adminRepository.update(id, updateAdminDto);
  }

  async findAll() {
    return this.adminRepository.findAll();
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async findByUsername(username: string) {
    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) {
      throw new NotFoundException(`Admin with username ${username} not found`);
    }
    
    // Map functional roles to roles array
    const roles = admin.functional_roles?.map(role => role.role) || [];
    return {
      ...admin,
      roles,
      functional_roles: roles,
      role: admin.role || Role.ADMIN
    };
  }

  async findByEmail(email: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  async remove(id: string) {
    try {
      await this.adminRepository.remove(id);
      this.loggingService.log(`Admin user ${id} deleted successfully`, 'Admin');
    } catch (error) {
      this.loggingService.error(`Error deleting admin user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyPassword(admin: any, password: string) {
    return bcrypt.compare(password, admin.password);
  }

  async updateLastLogin(id: string, ipAddress: string, userAgent: string) {
    await this.adminRepository.updateLastLogin(id, ipAddress, userAgent);
  }

  async toggleActive(id: string) {
    const admin = await this.findOne(id);
    return this.adminRepository.update(id, { is_active: !admin.is_active });
  }
} 