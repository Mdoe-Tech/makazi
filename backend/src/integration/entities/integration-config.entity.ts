import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum IntegrationType {
  NIDA = 'nida',
  SMS = 'sms',
  EMAIL = 'email',
  PAYMENT = 'payment'
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

@Entity()
export class IntegrationConfig extends BaseEntity {
  @Column({ unique: true })
  integration_name: string;

  @Column({ type: 'jsonb' })
  config: {
    api_key: string;
    api_secret: string;
    base_url: string;
    endpoints: {
      [key: string]: string;
    };
  };

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb' })
  metadata: {
    provider: string;
    version: string;
    last_sync: Date;
    status: string;
    last_modified_by: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  error_log: {
    timestamp: Date;
    error: string;
    details: any;
  }[];
} 