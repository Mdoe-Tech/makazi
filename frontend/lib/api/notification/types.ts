import { BaseEntity } from '../types';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  VERIFICATION = 'VERIFICATION',
  DOCUMENT = 'DOCUMENT',
  BIOMETRIC = 'BIOMETRIC',
  ALERT = 'ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Notification extends BaseEntity {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  recipient_id: string;
  recipient_type: string;
  is_read: boolean;
  read_at?: Date;
  metadata?: Record<string, any>;
  action_url?: string;
  action_text?: string;
  id: string;
  created_at: string;
  updated_at: string;
  read: boolean;
}

export interface CreateNotificationDto {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  recipient_id: string;
  recipient_type: string;
  metadata?: Record<string, any>;
  action_url?: string;
  action_text?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  recipient_id?: string;
  is_read?: boolean;
  start_date?: Date;
  end_date?: Date;
  read?: boolean;
  search?: string;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  notification_types: {
    [key in NotificationType]: boolean;
  };
} 