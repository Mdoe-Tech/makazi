import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { LoggingService } from '../../logging/logging.service';
import { NidaService } from './nida.service';

@Controller('nida')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NidaController {
  constructor(
    private readonly nidaService: NidaService,
    private readonly loggingService: LoggingService
  ) {}

    @Post('register')
  @Roles(Role.ADMIN)
  async registerCitizen(@Body() citizenData: any) {
    this.loggingService.log('Registering new citizen in NIDA system');
    return this.nidaService.registerCitizen(citizenData);
  }

  @Get(':nidaNumber')
  @Roles(Role.ADMIN, Role.VERIFIER)
  async getCitizenData(@Param('nidaNumber') nidaNumber: string) {
    this.loggingService.log(`Fetching NIDA data for number: ${nidaNumber}`);
    return this.nidaService.getCitizenData(nidaNumber);
  }

  @Post('verify')
  @Roles(Role.ADMIN, Role.VERIFIER)
  async verifyCitizen(@Body() verificationData: { nidaNumber: string; citizenData: any }) {
    this.loggingService.log(`Verifying NIDA data for number: ${verificationData.nidaNumber}`);
    return this.nidaService.verifyCitizen(verificationData.nidaNumber, verificationData.citizenData);
  }
} 