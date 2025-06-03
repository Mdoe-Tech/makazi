import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogRepository } from './audit-log.repository';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
    LoggingModule
  ],
  controllers: [AuditController],
  providers: [AuditService, AuditLogRepository],
  exports: [AuditService]
})
export class AuditModule {} 