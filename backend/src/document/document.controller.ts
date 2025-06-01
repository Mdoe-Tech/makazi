import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto, VerifyDocumentDto, RejectDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { LoggingService } from '../logging/logging.service';

@Controller('document')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly loggingService: LoggingService
  ) {}

  @Post('citizen/:id')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('id') citizenId: number,
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    this.loggingService.log(`Uploading document for citizen ${citizenId}`);
    return this.documentService.create(citizenId, createDocumentDto, file);
  }

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findAll() {
    this.loggingService.log('Fetching all documents');
    return this.documentService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findOne(@Param('id') id: number) {
    this.loggingService.log(`Fetching document ${id}`);
    return this.documentService.findOne(id.toString());
  }

  @Get('citizen/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findByCitizenId(@Param('id') citizenId: number) {
    this.loggingService.log(`Fetching documents for citizen ${citizenId}`);
    return this.documentService.findByCitizenId(citizenId.toString());
  }

  @Post(':id/verify')
  @Roles(Role.VERIFIER)
  @UsePipes(new ValidationPipe())
  async verify(
    @Param('id') id: number,
    @Body() verifyDocumentDto: VerifyDocumentDto,
    @Request() req
  ) {
    this.loggingService.log(`Verifying document ${id}`);
    return this.documentService.verify(id.toString(), verifyDocumentDto, req.user.id.toString());
  }

  @Post(':id/reject')
  @Roles(Role.VERIFIER)
  @UsePipes(new ValidationPipe())
  async reject(
    @Param('id') id: number,
    @Body() rejectDocumentDto: RejectDocumentDto,
    @Request() req
  ) {
    this.loggingService.log(`Rejecting document ${id}`);
    return this.documentService.reject(id.toString(), rejectDocumentDto, req.user.id.toString());
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    this.loggingService.log(`Deleting document ${id}`);
    return this.documentService.remove(id.toString());
  }
} 