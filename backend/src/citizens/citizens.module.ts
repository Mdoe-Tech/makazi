import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizensService } from './citizens.service';
import { Citizen } from './entities/citizen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Citizen])],
  providers: [CitizensService],
  exports: [CitizensService]
})
export class CitizensModule {} 