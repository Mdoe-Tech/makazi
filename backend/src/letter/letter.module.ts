import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { LetterRepository } from './letter.repository';
import { Letter } from './entities/letter.entity';
import { CitizenModule } from '../citizen/citizen.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter]),
    CitizenModule,
    LoggingModule
  ],
  controllers: [LetterController],
  providers: [LetterService, LetterRepository],
  exports: [LetterService]
})
export class LetterModule {} 