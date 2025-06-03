import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes, BadRequestException, HttpCode } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { Citizen } from './entities/citizen.entity';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { BiometricDataDto } from './dto/biometric.dto';
import { DocumentsDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { LoggingService } from '../logging/logging.service';
import { IsUUID } from 'class-validator';

class UUIDParam {
  @IsUUID()
  id: string;
}

@Controller('citizen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitizenController {
  constructor(
    private citizenService: CitizenService,
    private loggingService: LoggingService
  ) {}

  @Get()
  @Roles(Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  async findAll(): Promise<Citizen[]> {
    this.loggingService.log('Fetching all citizens');
    return this.citizenService.findAll();
  }

  @Get(':id')
  @Roles(Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param() params: UUIDParam): Promise<Citizen> {
    this.loggingService.log(`Fetching citizen with ID: ${params.id}`);
    return this.citizenService.findOne(params.id);
  }

  @Post()
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    this.loggingService.log('Creating new citizen registration');
    return this.citizenService.create(createCitizenDto);
  }

  @Put(':id')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param() params: UUIDParam, @Body() createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    this.loggingService.log(`Updating citizen with ID: ${params.id}`);
    return this.citizenService.update(params.id, createCitizenDto);
  }

  @Delete(':id')
  @Roles(Role.OFFICE_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Param() params: UUIDParam): Promise<void> {
    this.loggingService.log(`Deleting citizen with ID: ${params.id}`);
    return this.citizenService.remove(params.id);
  }

  // Registration workflow endpoints
  @Post(':id/biometric')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitBiometricData(
    @Param() params: UUIDParam,
    @Body() biometricData: BiometricDataDto
  ): Promise<Citizen> {
    this.loggingService.log(`Submitting biometric data for citizen ID: ${params.id}`);
    return this.citizenService.submitBiometricData(params.id, biometricData);
  }

  @Post(':id/documents')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitDocuments(
    @Param() params: UUIDParam,
    @Body() documents: DocumentsDto
  ): Promise<Citizen> {
    this.loggingService.log(`Submitting documents for citizen ID: ${params.id}`);
    return this.citizenService.submitDocuments(params.id, documents);
  }

  @Post(':id/nida')
  @Roles(Role.VERIFIER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyNIDA(
    @Param() params: UUIDParam,
    @Body('nidaNumber') nidaNumber: string
  ): Promise<Citizen> {
    this.loggingService.log(`Verifying NIDA for citizen ID: ${params.id}`);
    return this.citizenService.verifyNIDA(params.id, nidaNumber);
  }

  @Post(':id/approve')
  @Roles(Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async approveRegistration(@Param() params: UUIDParam): Promise<Citizen> {
    this.loggingService.log(`Approving registration for citizen ID: ${params.id}`);
    return this.citizenService.approveRegistration(params.id);
  }

  @Post(':id/reject')
  @Roles(Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async rejectRegistration(
    @Param() params: UUIDParam,
    @Body('reason') reason: string
  ): Promise<Citizen> {
    this.loggingService.log(`Rejecting registration for citizen ID: ${params.id}`);
    return this.citizenService.rejectRegistration(params.id, reason);
  }
} 