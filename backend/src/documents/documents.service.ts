import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { DocumentRequest } from './entities/document-request.entity';
import { DocumentType } from './enums/document-type.enum';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { DocumentStatus } from './enums/document-status.enum';
import PDFDocument from 'pdfkit';

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

  async approveDocumentRequest(
    id: string,
    data: { signature: string; stamp: string }
  ): Promise<DocumentRequest> {
    const request = await this.getDocumentRequest(id);

    request.status = DocumentStatus.APPROVED;
    request.signature_url = data.signature;
    request.stamp_url = data.stamp;
    request.approved_at = new Date();

    return this.documentRequestRepository.save(request);
  }

  async rejectDocumentRequest(id: string, reason: string): Promise<DocumentRequest> {
    const request = await this.getDocumentRequest(id);
    
    request.status = DocumentStatus.REJECTED;
    request.rejected_at = new Date();
    request.rejection_reason = reason;

    return this.documentRequestRepository.save(request);
  }

  async generateDocumentPdf(id: string): Promise<Buffer> {
    const request = await this.getDocumentRequest(id);
    if (!request) {
      throw new NotFoundException(`Document request with ID ${id} not found`);
    }

    console.log('Generating PDF for document:', {
      id: request.id,
      type: request.document_type,
      status: request.status
    });

    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `${request.document_type} Document`,
            Author: 'Makazi System',
            Subject: request.purpose,
            Keywords: 'document, official',
            CreationDate: new Date()
          }
        });

        // Collect PDF chunks
        doc.on('data', (chunk) => {
          console.log('Received PDF chunk of size:', chunk.length);
          chunks.push(chunk);
        });

        doc.on('end', () => {
          const finalBuffer = Buffer.concat(chunks);
          console.log('PDF generation complete. Final buffer size:', finalBuffer.length);
          resolve(finalBuffer);
        });

        doc.on('error', (err) => {
          console.error('PDF generation error:', err);
          reject(err);
        });

        // Add header
        doc.fontSize(20)
          .text('Official Document', { align: 'center' })
          .moveDown();

        // Add document details
        doc.fontSize(12)
          .text(`Document Type: ${request.document_type}`)
          .text(`Purpose: ${request.purpose}`)
          .text(`Status: ${request.status}`)
          .text(`Created: ${request.created_at.toLocaleDateString()}`)
          .moveDown();

        // Add citizen information
        if (request.citizen) {
          doc.text('Citizen Information:')
            .moveDown()
            .text(`Name: ${request.citizen.first_name} ${request.citizen.last_name}`)
            .text(`NIDA Number: ${request.citizen.nida_number}`)
            .text(`Email: ${request.citizen.email}`)
            .text(`Phone: ${request.citizen.phone_number}`)
            .moveDown();
        }

        // Add signature and stamp if approved
        if (request.status === DocumentStatus.APPROVED) {
          doc.text('Approved with:')
            .moveDown();

          if (request.signature_url) {
            doc.image(request.signature_url, {
              fit: [200, 100],
              align: 'center'
            });
          }

          if (request.stamp_url) {
            doc.image(request.stamp_url, {
              fit: [200, 200],
              align: 'center'
            });
          }
        }

        // Add footer
        doc.fontSize(10)
          .text(
            'This is an official document generated by the Makazi System',
            { align: 'center' }
          );

        // Finalize the PDF
        doc.end();
      } catch (error) {
        console.error('Error in PDF generation:', error);
        reject(error);
      }
    });
  }
} 