import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
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
  @Roles(Role.OFFICE_ADMIN)
  async registerCitizen(@Body() citizenData: any) {
    this.loggingService.log(
      'Registering new citizen in NIDA system',
      'NIDA',
      {
        action: 'register',
        citizenData: {
          first_name: citizenData.first_name,
          last_name: citizenData.last_name,
          date_of_birth: citizenData.date_of_birth,
          gender: citizenData.gender,
          nationality: citizenData.nationality
        }
      }
    );
    return this.nidaService.registerCitizen(citizenData);
  }

  @Get(':nidaNumber')
  @Roles(Role.OFFICE_ADMIN, Role.VERIFIER)
  async getCitizenData(@Param('nidaNumber') nidaNumber: string) {
    this.loggingService.log(
      `Fetching NIDA data for number: ${nidaNumber}`,
      'NIDA',
      {
        action: 'getCitizenData',
        nidaNumber,
        roles: [Role.OFFICE_ADMIN, Role.VERIFIER]
      }
    );
    return this.nidaService.getCitizenData(nidaNumber);
  }

  @Post('verify')
  @Roles(Role.OFFICE_ADMIN, Role.VERIFIER)
  async verifyCitizen(@Body() verificationData: { nidaNumber: string; citizenData: any }) {
    this.loggingService.log(
      `Verifying NIDA data for number: ${verificationData.nidaNumber}`,
      'NIDA',
      {
        action: 'verifyCitizen',
        nidaNumber: verificationData.nidaNumber,
        citizenData: {
          first_name: verificationData.citizenData.first_name,
          last_name: verificationData.citizenData.last_name,
          date_of_birth: verificationData.citizenData.date_of_birth,
          gender: verificationData.citizenData.gender,
          nationality: verificationData.citizenData.nationality
        },
        roles: [Role.OFFICE_ADMIN, Role.VERIFIER]
      }
    );
    return this.nidaService.verifyCitizen(verificationData.nidaNumber, verificationData.citizenData);
  }
} 