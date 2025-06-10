import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes, BadRequestException, HttpCode, ValidationPipe, Request, NotFoundException } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { Citizen } from './entities/citizen.entity';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { BiometricDataDto } from './dto/biometric.dto';
import { DocumentsDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';
import { IsUUID } from 'class-validator';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { CitizenRepository } from './citizen.repository';

class UUIDParam {
  @IsUUID()
  id: string;
}

@Controller('citizen')
@UseGuards(JwtAuthGuard)
export class CitizenController {
  constructor(
    private readonly citizenService: CitizenService,
    private readonly loggingService: LoggingService,
    private readonly citizenRepository: CitizenRepository
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    console.log('Profile request user:', req.user); // Debug log
    if (!req.user?.citizen_id) {
      console.error('No citizen_id in token:', req.user); // Debug log
      throw new BadRequestException('Citizen ID not found in token');
    }

    try {
      console.log('Fetching citizen with ID:', req.user.citizen_id); // Debug log
      const citizen = await this.citizenRepository.findById(req.user.citizen_id);
      console.log('Profile response:', citizen); // Debug log
      if (!citizen) {
        console.error('Citizen not found for ID:', req.user.citizen_id); // Debug log
        throw new NotFoundException('Citizen not found');
      }
      return {
        status: 'success',
        data: citizen
      };
    } catch (error) {
      console.error('Profile error:', error); // Debug log
      throw error;
    }
  }

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  async findAll(): Promise<Citizen[]> {
    this.loggingService.log(
      'Fetching all citizens',
      'Citizen',
      {
        action: 'findAll',
        roles: [Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER]
      }
    );
    return this.citizenService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param() params: UUIDParam): Promise<Citizen> {
    this.loggingService.log(
      `Fetching citizen with ID: ${params.id}`,
      'Citizen',
      {
        action: 'findOne',
        citizenId: params.id,
        roles: [Role.ADMIN, Role.REGISTRAR, Role.VERIFIER, Role.APPROVER]
      }
    );
    return this.citizenService.findOne(params.id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    this.loggingService.log(
      'Creating new citizen registration',
      'Citizen',
      {
        action: 'create',
        data: {
          first_name: createCitizenDto.first_name,
          last_name: createCitizenDto.last_name,
          middle_name: createCitizenDto.middle_name,
          date_of_birth: createCitizenDto.date_of_birth,
          gender: createCitizenDto.gender,
          nationality: createCitizenDto.nationality,
          phone_number: createCitizenDto.phone_number,
          address: createCitizenDto.address,
          nida_number: createCitizenDto.nida_number,
          birth_certificate_number: createCitizenDto.birth_certificate_number
        }
      }
    );
    return this.citizenService.create(createCitizenDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param() params: UUIDParam, @Body() updateCitizenDto: UpdateCitizenDto): Promise<Citizen> {
    this.loggingService.log(`Updating citizen with ID: ${params.id}`);
    return this.citizenService.update(params.id, updateCitizenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Param() params: UUIDParam): Promise<Citizen> {
    this.loggingService.log(`Deleting citizen with ID: ${params.id}`);
    return this.citizenService.remove(params.id);
  }

  // Registration workflow endpoints
  @Post(':id/biometric')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitBiometricData(
    @Param() params: UUIDParam,
    @Body() biometricData: BiometricDataDto
  ): Promise<Citizen> {
    this.loggingService.log(
      `Submitting biometric data for citizen ID: ${params.id}`,
      'Citizen',
      {
        action: 'submitBiometric',
        citizenId: params.id,
        biometricData: {
          quality_score: biometricData.quality_score,
          has_fingerprint: !!biometricData.fingerprint_data,
          has_facial: !!biometricData.facial_data,
          has_iris: !!biometricData.iris_data
        }
      }
    );
    return this.citizenService.submitBiometricData(params.id, biometricData);
  }

  @Post(':id/documents')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitDocuments(
    @Param() params: UUIDParam,
    @Body() documents: DocumentsDto
  ): Promise<Citizen> {
    this.loggingService.log(
      `Submitting documents for citizen ID: ${params.id}`,
      'Citizen',
      {
        action: 'submitDocuments',
        citizenId: params.id,
        documents: {
          document_count: Object.keys(documents).length
        }
      }
    );
    return this.citizenService.submitDocuments(params.id, documents);
  }

  @Post(':id/nida')
  @Roles(Role.VERIFIER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyNIDA(
    @Param() params: UUIDParam,
    @Body('nidaNumber') nidaNumber: string
  ): Promise<Citizen> {
    this.loggingService.log(
      `Verifying NIDA for citizen ID: ${params.id}`,
      'Citizen',
      {
        action: 'verifyNIDA',
        citizenId: params.id,
        nidaNumber: nidaNumber
      }
    );
    return this.citizenService.verifyNIDA(params.id, nidaNumber);
  }

  @Post(':id/approve')
  @Roles(Role.ADMIN, Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async approveRegistration(@Param() params: UUIDParam): Promise<Citizen> {
    this.loggingService.log(`Approving registration for citizen ID: ${params.id}`);
    return this.citizenService.approveRegistration(params.id);
  }

  @Post(':id/reject')
  @Roles(Role.ADMIN, Role.APPROVER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async rejectRegistration(
    @Param() params: UUIDParam,
    @Body('reason') reason: string
  ): Promise<Citizen> {
    this.loggingService.log(`Rejecting registration for citizen ID: ${params.id}`);
    return this.citizenService.rejectRegistration(params.id, reason);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateCitizenDto: UpdateCitizenDto) {
    const citizen = await this.citizenService.update(req.user.citizen_id, updateCitizenDto);
    return {
      status: 'success',
      data: citizen
    };
  }
} 