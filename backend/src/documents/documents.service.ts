import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { DocumentRequest } from './entities/document-request.entity';
import { DocumentType } from './enums/document-type.enum';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { DocumentStatus } from './enums/document-status.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    @InjectRepository(DocumentRequest)
    private documentRequestRepository: Repository<DocumentRequest>
  ) {}

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return this.documentTemplateRepository.find();
  }

  async getDocumentTemplate(type: DocumentType): Promise<DocumentTemplate> {
    const template = await this.documentTemplateRepository.findOne({
      where: { type }
    });

    if (!template) {
      throw new NotFoundException(`Document template of type ${type} not found`);
    }

    return template;
  }

  async createDocumentRequest(citizenId: string, dto: CreateDocumentRequestDto): Promise<DocumentRequest> {
    const template = await this.getDocumentTemplate(dto.document_type);

    const request = this.documentRequestRepository.create({
      citizen_id: citizenId,
      document_type: dto.document_type,
      purpose: dto.purpose,
      status: DocumentStatus.PENDING
    });

    return this.documentRequestRepository.save(request);
  }

  async getDocumentRequests(citizenId: string): Promise<DocumentRequest[]> {
    return this.documentRequestRepository.find({
      where: { citizen_id: citizenId },
      order: { created_at: 'DESC' }
    });
  }

  async getDocumentRequest(id: string): Promise<DocumentRequest> {
    const request = await this.documentRequestRepository.findOne({
      where: { id }
    });

    if (!request) {
      throw new NotFoundException(`Document request with ID ${id} not found`);
    }

    return request;
  }

  async approveDocumentRequest(id: string): Promise<DocumentRequest> {
    const request = await this.getDocumentRequest(id);
    
    request.status = DocumentStatus.APPROVED;
    request.approved_at = new Date();
    // TODO: Generate document and set document_url

    return this.documentRequestRepository.save(request);
  }

  async rejectDocumentRequest(id: string, reason: string): Promise<DocumentRequest> {
    const request = await this.getDocumentRequest(id);
    
    request.status = DocumentStatus.REJECTED;
    request.rejected_at = new Date();
    request.rejection_reason = reason;

    return this.documentRequestRepository.save(request);
  }
} 