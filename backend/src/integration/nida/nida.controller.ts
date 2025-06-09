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
} 