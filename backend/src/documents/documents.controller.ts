import { Controller, Get, Post, Body, Param, UseGuards, Request, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { DocumentType } from './enums/document-type.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('templates')
  async getDocumentTemplates() {
    const templates = await this.documentsService.getDocumentTemplates();
    return {
      status: 'success',
      data: templates
    };
  }

  @Get('templates/:type')
  async getDocumentTemplate(@Param('type') type: DocumentType) {
    const template = await this.documentsService.getDocumentTemplate(type);
    return {
      status: 'success',
      data: template
    };
  }

  @Post('request')
  async createDocumentRequest(
    @Request() req,
    @Body() dto: CreateDocumentRequestDto
  ) {
    if (!req.user.citizen_id) {
      return {
        status: 'error',
        message: 'Citizen ID not found in user session'
      };
    }

    const request = await this.documentsService.createDocumentRequest(
      req.user.citizen_id,
      dto
    );
    return {
      status: 'success',
      data: request
    };
  }

  @Get('requests')
  async getDocumentRequests(@Request() req) {
    // If user is admin, return all documents
    if (req.user.role === Role.ADMIN) {
      const requests = await this.documentsService.getAllDocumentRequests();
      return {
        status: 'success',
        data: requests
      };
    }
    
    // For non-admin users, return only their documents
    const requests = await this.documentsService.getDocumentRequests(
      req.user.citizen_id
    );
    return {
      status: 'success',
      data: requests
    };
  }

  @Get('requests/:id')
  async getDocumentRequest(@Param('id') id: string) {
    const request = await this.documentsService.getDocumentRequest(id);
    return {
      status: 'success',
      data: request
    };
  }

  @Post('requests/:id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.REGISTRAR)
  async approveDocumentRequest(
    @Param('id') id: string,
    @Body() data: { signature: string; stamp: string },
    @Request() req
  ) {
    // Check if user has required role
    const hasRole = req.user.role === Role.ADMIN || 
                   req.user.role === Role.REGISTRAR ||
                   (req.user.role === Role.ADMIN && req.user.functional_roles?.includes(Role.REGISTRAR));

    if (!hasRole) {
      throw new UnauthorizedException('You do not have permission to approve documents');
    }

    const request = await this.documentsService.approveDocumentRequest(id, data);
    return {
      status: 'success',
      data: request
    };
  }

  @Post('requests/:id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.REGISTRAR)
  async rejectDocumentRequest(
    @Param('id') id: string,
    @Body('reason') reason: string
  ) {
    const request = await this.documentsService.rejectDocumentRequest(id, reason);
    return {
      status: 'success',
      data: request
    };
  }

  @Get('requests/:id/download')
  async downloadDocument(@Param('id') id: string) {
    const pdfBuffer = await this.documentsService.generateDocumentPdf(id);
    return pdfBuffer;
  }

  @Get('requests/:id/preview')
  async previewDocument(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.documentsService.generateDocumentPdf(id);
      
      console.log('PDF Buffer length:', pdfBuffer.length);
      console.log('PDF Buffer type:', typeof pdfBuffer);
      console.log('Is Buffer:', Buffer.isBuffer(pdfBuffer));
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Content-Length': pdfBuffer.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate PDF preview'
      });
    }
  }
} 