import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { Report } from './entities/report.entity';
import { ReportRepository } from './report.repository';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    LoggingModule
  ],
  controllers: [ReportingController],
  providers: [ReportingService, ReportRepository],
  exports: [ReportingService]
})
export class ReportingModule {} 