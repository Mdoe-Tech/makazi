import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportType, ReportFormat } from './entities/report.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LoggingService } from '../logging/logging.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly loggingService: LoggingService
  ) {}

  @Post('generate')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async generateReport(
    @Body() body: {
      type: ReportType;
      parameters: any;
      format?: ReportFormat;
    },
    @Request() req
  ) {
    this.loggingService.log(`Generating ${body.type} report`);
    return this.reportingService.generateReport(
      body.type,
      body.parameters,
      req.user.admin_id,
      body.format
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll() {
    return this.reportingService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findOne(@Param('id') id: number) {
    return this.reportingService.findOne(id);
  }

  @Get('type/:type')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByType(@Param('type') type: ReportType) {
    return this.reportingService.findByType(type);
  }
} 