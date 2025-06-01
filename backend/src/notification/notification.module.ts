import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository]
})
export class NotificationModule {} 