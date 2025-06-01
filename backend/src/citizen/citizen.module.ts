import { Module } from '@nestjs/common';
import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { CitizenRepository } from './citizen.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';
import { NotificationModule } from '../notification/notification.module';
import { RegistrationValidationService } from './services/registration-validation.service';

@Module({
  imports: [DatabaseModule, LoggingModule, NotificationModule],
  controllers: [CitizenController],
  providers: [CitizenService, CitizenRepository, RegistrationValidationService],
  exports: [CitizenService, CitizenRepository],
})
export class CitizenModule {} 