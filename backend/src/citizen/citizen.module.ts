import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizenController } from './citizen.controller';
import { CitizenPublicController } from './citizen-public.controller';
import { CitizenService } from './citizen.service';
import { CitizenRepository } from './citizen.repository';
import { Citizen } from './entities/citizen.entity';
import { LoggingModule } from '../logging/logging.module';
import { NotificationModule } from '../notification/notification.module';
import { RegistrationValidationService } from './services/registration-validation.service';
import { NidaModule } from '../nida/nida.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Citizen]),
    LoggingModule,
    NotificationModule,
    NidaModule
  ],
  controllers: [CitizenController, CitizenPublicController],
  providers: [CitizenService, CitizenRepository, RegistrationValidationService],
  exports: [CitizenService, CitizenRepository]
})
export class CitizenModule {} 