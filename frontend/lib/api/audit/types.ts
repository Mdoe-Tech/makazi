import { BaseEntity } from '../types';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VERIFY = 'VERIFY',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

export enum AuditModule {
  CITIZEN = 'CITIZEN',
  DOCUMENT = 'DOCUMENT',
  BIOMETRIC = 'BIOMETRIC',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM'
}

export interface AuditLog extends BaseEntity {
  action: AuditAction;
  module: AuditModule;
  user_id: string;
  user_type: string;
  resource_id: string;
  resource_type: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  status: 'SUCCESS' | 'FAILURE';
  error_message?: string;
}

export interface AuditFilters {
  action?: AuditAction;
  module?: AuditModule;
  user_id?: string;
  resource_id?: string;
  resource_type?: string;
  start_date?: Date;
  end_date?: Date;
  status?: 'SUCCESS' | 'FAILURE';
} 