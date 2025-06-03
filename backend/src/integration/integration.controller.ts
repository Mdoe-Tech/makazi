import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationType } from './entities/integration-config.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';

@Controller('integration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly loggingService: LoggingService
  ) {}

  @Post('config')
  @Roles(Role.SUPER_ADMIN)
  async createConfig(
    @Body() body: {
      type: IntegrationType;
      name: string;
      config: any;
    },
    @Request() req
  ) {
    this.loggingService.log(`Creating integration config: ${body.type}`);
    return this.integrationService.createConfig(
      body.type,
      body.name,
      body.config,
      req.user.admin_id
    );
  }

  @Post('config/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateConfig(
    @Param('id') id: number,
    @Body('config') config: any,
    @Request() req
  ) {
    this.loggingService.log(`Updating integration config: ${id}`);
    return this.integrationService.updateConfig(id, config, req.user.admin_id);
  }

  @Post('config/:id/test')
  @Roles(Role.SUPER_ADMIN)
  async testConnection(@Param('id') id: number) {
    this.loggingService.log(`Testing integration connection: ${id}`);
    return this.integrationService.testConnection(id);
  }

  @Post('nida/verify')
  @Roles(Role.VERIFIER)
  async verifyNidaNumber(@Body('nida_number') nidaNumber: string) {
    this.loggingService.log(`Verifying NIDA number: ${nidaNumber}`);
    return this.integrationService.verifyNidaNumber(nidaNumber);
  }

  @Post('sms/send')
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  async sendSms(
    @Body() body: {
      phone_number: string;
      message: string;
    }
  ) {
    this.loggingService.log(`Sending SMS to: ${body.phone_number}`);
    return this.integrationService.sendSms(body.phone_number, body.message);
  }

  @Post('email/send')
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  async sendEmail(
    @Body() body: {
      to: string;
      subject: string;
      body: string;
    }
  ) {
    this.loggingService.log(`Sending email to: ${body.to}`);
    return this.integrationService.sendEmail(body.to, body.subject, body.body);
  }
} 