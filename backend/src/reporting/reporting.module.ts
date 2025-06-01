import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { LoggingModule } from '../logging/logging.module';
import { DatabaseModule } from '../database/database.module';
import { ReportRepository } from './report.repository';

@Module({
  imports: [
    DatabaseModule,
    LoggingModule
  ],
  controllers: [ReportingController],
  providers: [ReportingService, ReportRepository],
  exports: [ReportingService]
})
export class ReportingModule {} 