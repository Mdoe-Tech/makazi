import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { CustomLogger } from '../common/logger/logger.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LoggingService, CustomLogger],
  exports: [LoggingService],
})
export class LoggingModule {} 