import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LoggingService } from '../logging/logging.service';

@Controller('system-config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemConfigController {
  constructor(
    private readonly configService: SystemConfigService,
    private readonly loggingService: LoggingService
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getAllConfigs() {
    return this.configService.getAllConfigs();
  }

  @Get('category/:category')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getConfigsByCategory(@Param('category') category: string) {
    return this.configService.getConfigsByCategory(category);
  }

  @Get(':key')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getConfig(@Param('key') key: string) {
    return this.configService.getConfig(key);
  }

  @Post(':key')
  @Roles(Role.SUPER_ADMIN)
  async setConfig(
    @Param('key') key: string,
    @Body('value') value: any,
    @Request() req
  ) {
    this.loggingService.log(`Updating system config: ${key}`);
    return this.configService.setConfig(key, value, req.user.admin_id);
  }

  @Post(':key/toggle')
  @Roles(Role.SUPER_ADMIN)
  async toggleConfig(
    @Param('key') key: string,
    @Request() req
  ) {
    this.loggingService.log(`Toggling system config: ${key}`);
    return this.configService.toggleConfig(key, req.user.admin_id);
  }
} 