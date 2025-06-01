import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { IntegrationRepository } from './integration.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    DatabaseModule,
    LoggingModule
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService, IntegrationRepository],
  exports: [IntegrationService]
})
export class IntegrationModule {} 