import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus } from './enums/notification-status.enum';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/create-notification.dto';
import { LoggingService } from '../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import { RegistrationStatus } from '../citizen/enums/registration-status.enum';
import * as swMessages from '../i18n/sw/sw.json';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  private readonly smsEnabled: boolean;
  private readonly emailEnabled: boolean;

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService
  ) {
    this.smsEnabled = this.configService.get<boolean>('NOTIFICATION_SMS_ENABLED', false);
    this.emailEnabled = this.configService.get<boolean>('NOTIFICATION_EMAIL_ENABLED', false);
  }

  async create(createNotificationDto: CreateNotificationDto) {
    this.loggingService.log('Creating new notification');
    return this.notificationRepository.create(createNotificationDto);
  }

  async findAll() {
    return this.notificationRepository.findAll();
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOne(id);
    if (!notification) {
      throw new NotFoundException(swMessages.notification.not_found);
    }
    return notification;
  }

  async findByRecipient(recipientId: string, recipientType: string) {
    return this.notificationRepository.findByRecipient(recipientId, recipientType);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);
    const updatedData = {
      ...notification,
      ...updateNotificationDto,
      metadata: {
        ...notification.metadata,
        ...updateNotificationDto.metadata
      }
    };
    return this.notificationRepository.update(id, updatedData);
  }

  async markAsRead(id: string) {
    return this.notificationRepository.markAsRead(id);
  }

  async markAsArchived(id: string) {
    return this.notificationRepository.markAsArchived(id);
  }

  async remove(id: string) {
    await this.notificationRepository.delete(id);
  }

  async recordDeliveryAttempt(
    id: string,
    status: 'success' | 'failed',
    error?: string
  ) {
    return this.notificationRepository.recordDeliveryAttempt(id, status, error);
  }

  async sendStatusChangeNotification(
    citizenId: string,
    oldStatus: RegistrationStatus,
    newStatus: RegistrationStatus,
    phoneNumber: string
  ) {
    const message = this.generateStatusMessage(oldStatus, newStatus);
    
    // Log the notification
    this.loggingService.log(
      `Sending status change notification to citizen ${citizenId}: ${message}`
    );

    // TODO: Implement actual SMS/email sending logic here
    // For now, we'll just log the notification
    console.log(`SMS to ${phoneNumber}: ${message}`);
  }

  private generateStatusMessage(oldStatus: RegistrationStatus, newStatus: RegistrationStatus): string {
    const statusTranslation = swMessages.enums.registration_status[newStatus];
    
    switch (newStatus) {
      case RegistrationStatus.APPROVED:
        return `Hongera! Usajili wako umekubaliwa.`;
      case RegistrationStatus.REJECTED:
        return `Samahani, usajili wako umekataliwa. Tafadhali rudi ofisini kwa maelezo zaidi.`;
      default:
        return `Hali ya usajili wako imebadilika kutoka ${swMessages.enums.registration_status[oldStatus]} hadi ${statusTranslation}.`;
    }
  }

  async sendRejectionNotification(
    citizenId: string,
    phoneNumber: string,
    reason: string
  ) {
    const message = `Samahani, usajili wako umekataliwa. Sababu: ${reason}. Tafadhali rudi ofisini kwa maelezo zaidi.`;
    
    // Log the notification
    this.loggingService.log(
      `Sending rejection notification to citizen ${citizenId}`
    );

    // TODO: Implement actual SMS/email sending logic here
    // For now, we'll just log the notification
    console.log(`SMS to ${phoneNumber}: ${message}`);
  }
} 