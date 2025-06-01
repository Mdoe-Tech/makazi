import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportRepository extends BaseRepository<Report> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'report');
  }

  async findAll(): Promise<Report[]> {
    return this.find({});
  }

  async findByType(type: string): Promise<Report[]> {
    return this.find({ report_type: type });
  }
} 