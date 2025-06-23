import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AdminRole } from './entities/admin-role.entity';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(AdminRole)
    private readonly adminRoleRepository: Repository<AdminRole>
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { functional_roles, roles, permissions, ...adminData } = createAdminDto;

    // Use transaction to ensure both admin and roles are saved
    return this.adminRepository.manager.transaction(async transactionalEntityManager => {
      // Create admin with default role ADMIN
      const admin = transactionalEntityManager.create(Admin, {
        ...adminData,
        role: Role.ADMIN,
        permissions: permissions as any
      });

      const savedAdmin = await transactionalEntityManager.save(Admin, admin);

      // Save functional roles - use either functional_roles or roles array
      const rolesToSave = functional_roles || roles || [];
      let savedRoles = [];
      if (rolesToSave.length > 0) {
        savedRoles = await transactionalEntityManager.save(
          AdminRole,
          rolesToSave.map(role => ({
            admin_id: savedAdmin.id,
            role: role
          }))
        );
      }

      // Attach functional_roles to the returned admin object
      (savedAdmin as any).functional_roles = savedRoles;
      return savedAdmin;
    });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const { functional_roles, permissions, ...adminData } = updateAdminDto;
    await this.adminRepository.update(id, {
      ...adminData,
      permissions: permissions as any
    });

    // Update functional roles if provided
    if (functional_roles) {
      // Remove existing roles
      await this.adminRoleRepository.delete({ admin_id: id });
      
      // If SUPER_ADMIN, give all functional roles
      if (adminData.role === Role.SUPER_ADMIN) {
        const allFunctionalRoles = [
          Role.REGISTRAR,
          Role.VERIFIER,
          Role.APPROVER,
          Role.VIEWER
        ];
        for (const role of allFunctionalRoles) {
          await this.adminRoleRepository.save({
            admin_id: id,
            role: role
          });
        }
      }
      // For ADMIN, add specified functional roles
      else if (adminData.role === Role.ADMIN) {
        for (const role of functional_roles) {
          await this.adminRoleRepository.save({
            admin_id: id,
            role: role
          });
        }
      }
    }

    return this.findById(id);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({
      relations: ['functional_roles']
    });
  }

  async findById(id: string): Promise<Admin> {
    return this.adminRepository.findOne({
      where: { id },
      relations: ['functional_roles']
    });
  }

  async findByUsername(username: string): Promise<Admin> {
    return this.adminRepository.findOne({
      where: { username },
      relations: ['functional_roles'],
      select: {
        id: true,
        username: true,
        password: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        role: true,
        is_active: true,
        permissions: true,
        last_login: true,
        functional_roles: {
          id: true,
          role: true
        }
      }
    });
  }

  async findByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOne({
      where: { email },
      relations: ['functional_roles']
    });
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Use a transaction to ensure both operations succeed or fail together
    await this.adminRepository.manager.transaction(async transactionalEntityManager => {
      // First remove the admin roles
      await transactionalEntityManager.delete(AdminRole, { admin_id: id });
      // Then remove the admin using the loaded entity
      await transactionalEntityManager.remove(Admin, admin);
    });
  }

  async updateLastLogin(id: string, ipAddress: string, userAgent: string): Promise<void> {
    await this.adminRepository.update(id, {
      last_login: {
        timestamp: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent
      }
    });
  }

  async getAdminFunctionalRoles(id: string): Promise<Role[]> {
    const adminRoles = await this.adminRoleRepository.find({
      where: { admin_id: id }
    });
    return adminRoles.map(ar => ar.role);
  }
} 