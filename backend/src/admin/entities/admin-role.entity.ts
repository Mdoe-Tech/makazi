import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Admin } from './admin.entity';
import { Role } from '../../auth/enums/role.enum';

@Entity('admin_roles')
export class AdminRole extends BaseEntity {
  @Column('uuid')
  admin_id: string;

  @ManyToOne(() => Admin, admin => admin.functional_roles)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({
    type: 'enum',
    enum: Role
  })
  role: Role; // Functional role (REGISTRAR, VERIFIER, etc.)
} 