import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricMatchingService } from './services/biometric-matching.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { LoggingService } from '../logging/logging.service';

@Controller('biometric')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BiometricController {
  constructor(
    private readonly biometricService: BiometricService,
    private readonly biometricMatchingService: BiometricMatchingService,
    private readonly loggingService: LoggingService
  ) {}

  @Post('citizen/:id')
  @Roles(Role.REGISTRAR)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('id') citizenId: number,
    @Body() createBiometricDto: CreateBiometricDto
  ) {
    this.loggingService.log(
      `Creating fingerprint data for citizen ${citizenId}`,
      'Biometric',
      {
        action: 'create',
        citizenId,
        biometricData: {
          quality_score: createBiometricDto.quality_score,
          capture_device: createBiometricDto.capture_device,
          has_fingerprint: !!createBiometricDto.fingerprint_data
        }
      }
    );
    return this.biometricService.create(createBiometricDto);
  }

  @Get()
  @Roles(Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findAll() {
    this.loggingService.log(
      'Fetching all biometric records',
      'Biometric',
      {
        action: 'findAll',
        roles: [Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER]
      }
    );
    return this.biometricService.findAll();
  }

  @Get(':id')
  @Roles(Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findOne(@Param('id') id: number) {
    this.loggingService.log(
      `Fetching biometric record ${id}`,
      'Biometric',
      {
        action: 'findOne',
        biometricId: id,
        roles: [Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER]
      }
    );
    return this.biometricService.findOne(id.toString());
  }

  @Get('citizen/:id')
  @Roles(Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findByCitizenId(@Param('id') citizenId: number) {
    this.loggingService.log(
      `Fetching fingerprint data for citizen ${citizenId}`,
      'Biometric',
      {
        action: 'findByCitizenId',
        citizenId,
        roles: [Role.OFFICE_ADMIN, Role.REGISTRAR, Role.VERIFIER]
      }
    );
    return this.biometricService.findByCitizenId(citizenId.toString());
  }

  @Post(':id/validate')
  @Roles(Role.VERIFIER)
  async validateBiometric(
    @Param('id') id: number,
    @Body('qualityThreshold') qualityThreshold?: number
  ) {
    this.loggingService.log(`Validating fingerprint data ${id}`);
    return this.biometricService.validateBiometric(id.toString(), qualityThreshold);
  }

  @Post('match/fingerprint')
  @Roles(Role.VERIFIER)
  async matchFingerprint(
    @Body('fingerprintData') fingerprintData: string,
    @Body('threshold') threshold?: number
  ) {
    this.loggingService.log('Matching fingerprint data');
    return this.biometricMatchingService.matchFingerprint(fingerprintData, threshold);
  }

  @Delete(':id')
  @Roles(Role.OFFICE_ADMIN)
  async remove(@Param('id') id: number) {
    this.loggingService.log(`Deleting biometric record ${id}`);
    return this.biometricService.remove(id.toString());
  }
} 