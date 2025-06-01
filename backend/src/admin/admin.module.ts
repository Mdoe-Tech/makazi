import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {} 
 