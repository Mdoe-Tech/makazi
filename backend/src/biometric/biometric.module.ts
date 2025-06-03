import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricController } from './biometric.controller';
import { BiometricService } from './biometric.service';
import { BiometricRepository } from './biometric.repository';
import { Biometric } from './entities/biometric.entity';
import { LoggingModule } from '../logging/logging.module';
import { BiometricMatchingService } from './services/biometric-matching.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Biometric]),
    LoggingModule
  ],
  controllers: [BiometricController],
  providers: [BiometricService, BiometricRepository, BiometricMatchingService],
  exports: [BiometricService, BiometricRepository]
})
export class BiometricModule {} 