import { Injectable, NotFoundException } from '@nestjs/common';
import { Report, ReportType, ReportFormat } from './entities/report.entity';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportingService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly loggingService: LoggingService
  ) {}

  async generateReport(
    type: ReportType,
    parameters: any,
    userId: number,
    format: ReportFormat = ReportFormat.PDF
  ): Promise<Report> {
    this.loggingService.log(`Generating ${type} report`);

    const report = {
      report_type: type,
      title: `${type} Report`,
      parameters,
      data: {},
      generated_by: userId.toString(),
      metadata: {
        format,
        size: 0,
        generation_time: 0,
        filters: []
      }
    };

    return this.reportRepository.create(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.findAll();
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne(id.toString());
    if (!report) {
      throw new NotFoundException(swMessages.reporting.not_found);
    }
    return report;
  }

  async findByType(type: ReportType): Promise<Report[]> {
    return this.reportRepository.findByType(type);
  }
} 