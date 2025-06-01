import { Entity, Column } from 'typeorm';
import { Role } from '../../auth/guards/roles.guard';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Admin extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN
  })
  role: Role;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  permissions: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  last_login: {
    timestamp: Date;
    ip_address: string;
    user_agent: string;
  };
} 