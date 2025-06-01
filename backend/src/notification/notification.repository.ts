import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from './enums/notification-status.enum';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'notifications');
  }

  async findAll(): Promise<Notification[]> {
    return this.find({});
  }

  async findByRecipient(recipientId: string, recipientType: string): Promise<Notification[]> {
    return this.find({ recipient_id: recipientId, recipient_type: recipientType });
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { 
      status: NotificationStatus.READ,
      is_read: true,
      read_at: new Date()
    });
  }

  async markAsArchived(id: string): Promise<Notification> {
    return this.update(id, { 
      status: NotificationStatus.ARCHIVED
    });
  }

  async recordDeliveryAttempt(id: string, status: 'success' | 'failed', error?: string): Promise<Notification> {
    const notification = await this.findOne(id);
    const attempts = notification.delivery_attempts || [];
    attempts.push({
      timestamp: new Date(),
      status,
      error
    });
    return this.update(id, { delivery_attempts: attempts });
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    return this.find({ status });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Notification[]> {
    return this.find({
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }
} 