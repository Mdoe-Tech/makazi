import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType, DocumentStatus } from './entities/document.entity';
import { VerificationStatus } from './enums/verification-status.enum';
import { CreateDocumentDto, VerifyDocumentDto, RejectDocumentDto } from './dto/create-document.dto';
import { LoggingService } from '../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import * as swMessages from '../i18n/sw/sw.json';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {
  private readonly uploadDir: string;

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService
  ) {
    this.uploadDir = this.configService.get<string>('DOCUMENT_UPLOAD_DIR', 'uploads/documents');
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async create(citizenId: number, createDocumentDto: CreateDocumentDto, file: Express.Multer.File): Promise<Document> {
    this.loggingService.log(`Creating document for citizen ${citizenId}`);

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    // Save file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    const documentData = {
      citizen_id: citizenId.toString(),
      document_type: createDocumentDto.document_type,
      document_number: createDocumentDto.document_number,
      issue_date: createDocumentDto.issue_date,
      expiry_date: createDocumentDto.expiry_date,
      issuing_authority: createDocumentDto.issuing_authority,
      document_data: {
        file_path: filePath,
        file_type: file.mimetype,
        file_size: file.size,
        upload_date: new Date()
      },
      verification_status: createDocumentDto.verification_status
    };

    return this.documentRepository.create(documentData);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepository.findAll();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne(id);
    if (!document) {
      throw new NotFoundException(swMessages.document.not_found);
    }
    return document;
  }

  async findByCitizenId(citizenId: string): Promise<Document[]> {
    return this.documentRepository.findByCitizenId(citizenId);
  }

  async findByType(citizenId: string, type: string): Promise<Document | null> {
    const documents = await this.documentRepository.findByType(type as DocumentType);
    return documents.find(doc => doc.citizen_id === citizenId) || null;
  }

  async update(id: string, updateData: Record<string, any>) {
    return this.documentRepository.update(id, updateData);
  }

  async verify(id: string, verifyDocumentDto: VerifyDocumentDto, verifierId: string) {
    const document = await this.findOne(id);

    if (document.verification_status === VerificationStatus.VERIFIED) {
      throw new Error('Document is already verified');
    }

    const updateData = {
      verification_status: VerificationStatus.VERIFIED,
      verification_date: new Date(),
      verified_by: verifierId,
      verification_notes: verifyDocumentDto.verification_notes
    };

    return this.documentRepository.update(id, updateData);
  }

  async reject(id: string, rejectDocumentDto: RejectDocumentDto, verifierId: string) {
    const document = await this.findOne(id);

    if (document.verification_status === VerificationStatus.REJECTED) {
      throw new Error('Document is already rejected');
    }

    const updateData = {
      verification_status: VerificationStatus.REJECTED,
      verification_date: new Date(),
      verified_by: verifierId,
      rejection_reason: rejectDocumentDto.rejection_reason
    };

    return this.documentRepository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);

    // Delete file from disk
    try {
      await fs.promises.unlink(document.document_data.file_path);
    } catch (error) {
      this.loggingService.log(`Error deleting file for document ${id}: ${error.message}`);
    }

    await this.documentRepository.remove(id);
    this.loggingService.log(`Document ${id} deleted`);
  }
} 