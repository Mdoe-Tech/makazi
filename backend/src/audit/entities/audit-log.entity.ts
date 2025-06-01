import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VERIFY = 'verify',
  REJECT = 'reject',
  APPROVE = 'approve',
  EXPORT = 'export',
  IMPORT = 'import',
  CONFIG_CHANGE = 'config_change'
}

export enum AuditEntity {
  CITIZEN = 'citizen',
  DOCUMENT = 'document',
  BIOMETRIC = 'biometric',
  ADMIN = 'admin',
  SYSTEM_CONFIG = 'system_config',
  REPORT = 'report'
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column({
    type: 'enum',
    enum: AuditAction
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntity
  })
  entity: AuditEntity;

  @Column()
  entity_id: number;

  @Column()
  user_id: number;

  @Column()
  user_role: string;

  @Column('jsonb')
  changes: {
    before?: any;
    after?: any;
    fields?: string[];
  };

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ nullable: true })
  additional_info: string;

  @CreateDateColumn()
  created_at: Date;
} 