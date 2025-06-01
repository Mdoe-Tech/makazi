import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { NotificationStatus } from '../enums/notification-status.enum';

@Entity()
export class Notification extends BaseEntity {
  @Column()
  recipient_id: string;

  @Column()
  recipient_type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'jsonb' })
  data: {
    [key: string]: any;
  };

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  read_at: Date;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  status: NotificationStatus;

  @Column({ type: 'jsonb' })
  metadata: {
    priority: string;
    category: string;
    source: string;
  };

  @Column({ type: 'jsonb', default: [] })
  delivery_attempts: Array<{
    timestamp: Date;
    status: 'success' | 'failed';
    error?: string;
  }>;
} 