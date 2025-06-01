import { Module } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { SystemConfigController } from './system-config.controller';
import { SystemConfigRepository } from './system-config.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    DatabaseModule,
    LoggingModule
  ],
  controllers: [SystemConfigController],
  providers: [SystemConfigService, SystemConfigRepository],
  exports: [SystemConfigService]
})
export class SystemConfigModule {} 