import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationType } from '../enums/notification.enum';

export class CreateNotificationDto {
  @IsString()
  recipient_id: string;

  @IsString()
  recipient_type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  type: string;

  @IsObject()
  metadata: {
    priority: string;
    category: string;
    source: string;
    action_url?: string;
    action_text?: string;
    related_entity_id?: string;
    related_entity_type?: string;
  };
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    priority?: string;
    category?: string;
    source?: string;
    action_url?: string;
    action_text?: string;
    related_entity_id?: string;
    related_entity_type?: string;
  };
} 