import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../auth/enums/role.enum';
import { AdminRole } from './admin-role.entity';

@Entity('admin')
export class Admin extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN
  })
  role: Role; // Primary role (SUPER_ADMIN, ADMIN, CITIZEN)

  @OneToMany(() => AdminRole, adminRole => adminRole.admin, { eager: true })
  functional_roles: AdminRole[]; // Functional roles (REGISTRAR, VERIFIER, etc.)

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  permissions: any;

  @Column({ type: 'jsonb', nullable: true })
  last_login: {
    timestamp: Date;
    ip_address: string;
    user_agent: string;
  };
} 