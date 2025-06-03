import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { CitizenRepository } from './citizen.repository';
import { Citizen } from './entities/citizen.entity';
import { LoggingModule } from '../logging/logging.module';
import { NotificationModule } from '../notification/notification.module';
import { RegistrationValidationService } from './services/registration-validation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Citizen]),
    LoggingModule,
    NotificationModule
  ],
  controllers: [CitizenController],
  providers: [CitizenService, CitizenRepository, RegistrationValidationService],
  exports: [CitizenService, CitizenRepository]
})
export class CitizenModule {} 