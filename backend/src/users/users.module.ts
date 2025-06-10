import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {} 