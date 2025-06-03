import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  VERIFY = 'VERIFY'
}

export enum AuditEntity {
  CITIZEN = 'CITIZEN',
  DOCUMENT = 'DOCUMENT',
  BIOMETRIC = 'BIOMETRIC',
  ADMIN = 'ADMIN',
  LETTER = 'LETTER',
  NOTIFICATION = 'NOTIFICATION'
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntity
  })
  entity_type: AuditEntity;

  @Column()
  entity_id: string;

  @Column()
  user_id: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 