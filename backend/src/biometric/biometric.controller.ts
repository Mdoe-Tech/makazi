import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricMatchingService } from './services/biometric-matching.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
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
    this.loggingService.log(`Creating biometric data for citizen ${citizenId}`);
    return this.biometricService.create(createBiometricDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findAll() {
    this.loggingService.log('Fetching all biometric records');
    return this.biometricService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findOne(@Param('id') id: number) {
    this.loggingService.log(`Fetching biometric record ${id}`);
    return this.biometricService.findOne(id.toString());
  }

  @Get('citizen/:id')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.VERIFIER)
  async findByCitizenId(@Param('id') citizenId: number) {
    this.loggingService.log(`Fetching biometric data for citizen ${citizenId}`);
    return this.biometricService.findByCitizenId(citizenId.toString());
  }

  @Post(':id/validate')
  @Roles(Role.VERIFIER)
  async validateBiometric(
    @Param('id') id: number,
    @Body('qualityThreshold') qualityThreshold?: number
  ) {
    this.loggingService.log(`Validating biometric data ${id}`);
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
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    this.loggingService.log(`Deleting biometric record ${id}`);
    return this.biometricService.remove(id.toString());
  }
} 