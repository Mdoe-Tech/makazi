import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType, DocumentStatus } from './entities/document.entity';
import { VerificationStatus } from './enums/verification-status.enum';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repository: Repository<Document>
  ) {}

  async findAll(): Promise<Document[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Document | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCitizenId(citizenId: string): Promise<Document[]> {
    return this.repository.find({
      where: {
        citizen_id: citizenId
      }
    });
  }

  async create(data: Partial<Document>): Promise<Document> {
    const document = this.repository.create(data);
    return this.repository.save(document);
  }

  async update(id: string, data: Partial<Document>): Promise<Document> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByType(type: DocumentType): Promise<Document[]> {
    return this.repository.find({
      where: {
        document_type: type
      }
    });
  }

  async findByStatus(status: VerificationStatus): Promise<Document[]> {
    return this.repository.find({
      where: {
        verification_status: status
      }
    });
  }
} 