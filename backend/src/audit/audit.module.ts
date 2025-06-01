import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogRepository } from './audit-log.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [AuditController],
  providers: [AuditService, AuditLogRepository],
  exports: [AuditService, AuditLogRepository]
})
export class AuditModule {} 