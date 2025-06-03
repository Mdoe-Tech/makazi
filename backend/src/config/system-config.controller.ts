import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';
import { ConfigCategory } from './entities/system-config.entity';

@Controller('system-config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemConfigController {
  constructor(
    private readonly configService: SystemConfigService,
    private readonly loggingService: LoggingService
  ) {}

  @Get()
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  async getAllConfigs() {
    return this.configService.findAll();
  }

  @Get('category/:category')
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  async getConfigsByCategory(@Param('category') category: ConfigCategory) {
    return this.configService.findByCategory(category);
  }

  @Get(':key')
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  async getConfig(@Param('key') key: string) {
    return this.configService.findOne(key);
  }

  @Post(':key')
  @Roles(Role.SUPER_ADMIN)
  async setConfig(
    @Param('key') key: string,
    @Body('value') value: any,
    @Request() req
  ) {
    this.loggingService.log(`Updating system config: ${key}`);
    return this.configService.update(key, { value, updated_by: req.user.admin_id });
  }

  @Post(':key/toggle')
  @Roles(Role.SUPER_ADMIN)
  async toggleConfig(
    @Param('key') key: string,
    @Request() req
  ) {
    this.loggingService.log(`Toggling system config: ${key}`);
    return this.configService.toggleActive(key);
  }
} 