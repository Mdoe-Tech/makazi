import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportType } from './entities/report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>
  ) {}

  async findAll(): Promise<Report[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Report | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Report>): Promise<Report> {
    const report = this.repository.create(data);
    return this.repository.save(report);
  }

  async findByType(type: ReportType): Promise<Report[]> {
    return this.repository.find({
      where: { type }
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 