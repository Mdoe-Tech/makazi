import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from './enums/notification-status.enum';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByRecipient(recipientId: string, recipientType: string): Promise<Notification[]> {
    return this.repository.find({
      where: {
        recipient_id: recipientId,
        recipient_type: recipientType
      }
    });
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.repository.create(data);
    return this.repository.save(notification);
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async markAsRead(id: string): Promise<void> {
    await this.repository.update(id, {
      status: NotificationStatus.READ,
      is_read: true,
      read_at: new Date()
    });
  }

  async markAsArchived(id: string): Promise<void> {
    await this.repository.update(id, {
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
    return this.repository.find({ where: { status } });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Notification[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate)
      }
    });
  }
} 