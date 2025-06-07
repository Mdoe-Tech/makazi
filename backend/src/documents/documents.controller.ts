import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
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
  async approveDocumentRequest(@Param('id') id: string) {
    const request = await this.documentsService.approveDocumentRequest(id);
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
} 