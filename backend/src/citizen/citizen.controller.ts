import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { Citizen } from './entities/citizen.entity';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { BiometricDataDto } from './dto/biometric.dto';
import { DocumentsDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { LoggingService } from '../logging/logging.service';

@Controller('citizen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitizenController {
  constructor(
    private citizenService: CitizenService,
    private loggingService: LoggingService
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  async findAll(): Promise<Citizen[]> {
    this.loggingService.log('Fetching all citizens');
    return this.citizenService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  async findOne(@Param('id') id: number): Promise<Citizen> {
    this.loggingService.log(`Fetching citizen with ID: ${id}`);
    return this.citizenService.findOne(id.toString());
  }

  @Post()
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  async create(@Body() createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    this.loggingService.log('Creating new citizen registration');
    return this.citizenService.create(createCitizenDto);
  }

  @Put(':id')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: number, @Body() createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    this.loggingService.log(`Updating citizen with ID: ${id}`);
    return this.citizenService.update(id.toString(), createCitizenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    this.loggingService.log(`Deleting citizen with ID: ${id}`);
    return this.citizenService.remove(id.toString());
  }

  // Registration workflow endpoints
  @Post(':id/biometric')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  async submitBiometricData(
    @Param('id') id: number,
    @Body() biometricData: BiometricDataDto
  ): Promise<Citizen> {
    this.loggingService.log(`Submitting biometric data for citizen ID: ${id}`);
    return this.citizenService.submitBiometricData(id.toString(), biometricData);
  }

  @Post(':id/documents')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  async submitDocuments(
    @Param('id') id: number,
    @Body() documents: DocumentsDto
  ): Promise<Citizen> {
    this.loggingService.log(`Submitting documents for citizen ID: ${id}`);
    return this.citizenService.submitDocuments(id.toString(), documents);
  }

  @Post(':id/nida')
  @Roles(Role.VERIFIER)
  async verifyNIDA(
    @Param('id') id: number,
    @Body('nidaNumber') nidaNumber: string
  ): Promise<Citizen> {
    this.loggingService.log(`Verifying NIDA for citizen ID: ${id}`);
    return this.citizenService.verifyNIDA(id.toString(), nidaNumber);
  }

  @Post(':id/approve')
  @Roles(Role.APPROVER)
  async approveRegistration(@Param('id') id: number): Promise<Citizen> {
    this.loggingService.log(`Approving registration for citizen ID: ${id}`);
    return this.citizenService.approveRegistration(id.toString());
  }

  @Post(':id/reject')
  @Roles(Role.APPROVER)
  async rejectRegistration(
    @Param('id') id: number,
    @Body('reason') reason: string
  ): Promise<Citizen> {
    this.loggingService.log(`Rejecting registration for citizen ID: ${id} with reason: ${reason}`);
    return this.citizenService.rejectRegistration(id.toString(), reason);
  }
} 