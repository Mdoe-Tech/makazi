import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { Admin } from './entities/admin.entity';
import { LoggingModule } from '../logging/logging.module';
import { AdminRole } from './entities/admin-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminRole]),
    LoggingModule
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository]
})
export class AdminModule {} 
 