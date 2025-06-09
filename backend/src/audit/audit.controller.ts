import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditAction, AuditEntity } from './entities/audit-log.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly loggingService: LoggingService
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll() {
    return this.auditService.findAll();
  }

  @Get('entity/:entity/:id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByEntity(
    @Param('entity') entity: AuditEntity,
    @Param('id') id: number
  ) {
    return this.auditService.findByEntity(entity, id.toString());
  }

  @Get('user/:id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByUser(@Param('id') id: number) {
    return this.auditService.findByUser(id.toString());
  }

  @Get('action/:action')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByAction(@Param('action') action: AuditAction) {
    return this.auditService.findByAction(action);
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByDateRange(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string
  ) {
    return this.auditService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Post('compliance-report')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async generateComplianceReport(
    @Body() body: { start_date: string; end_date: string }
  ) {
    this.loggingService.log('Generating compliance report');
    return this.auditService.generateComplianceReport(
      new Date(body.start_date),
      new Date(body.end_date)
    );
  }
} 