import { Module } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricController } from './biometric.controller';
import { BiometricRepository } from './biometric.repository';
import { BiometricMatchingService } from './services/biometric-matching.service';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [BiometricController],
  providers: [BiometricService, BiometricRepository, BiometricMatchingService],
  exports: [BiometricService]
})
export class BiometricModule {} 