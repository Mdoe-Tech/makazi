import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfigService } from './system-config.service';
import { SystemConfigController } from './system-config.controller';
import { SystemConfigRepository } from './system-config.repository';
import { SystemConfig } from './entities/system-config.entity';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemConfig]),
    LoggingModule
  ],
  providers: [SystemConfigService, SystemConfigRepository],
  controllers: [SystemConfigController],
  exports: [SystemConfigService]
})
export class SystemConfigModule {} 