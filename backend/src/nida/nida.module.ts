import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nida } from './entities/nida.entity';
import { NidaVerification } from './entities/nida-verification.entity';
import { NidaController } from './nida.controller';
import { NidaRepository } from './nida.repository';
import { NidaService } from './nida.service';
import { Citizen } from '../citizen/entities/citizen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nida, NidaVerification, Citizen])
  ],
  controllers: [NidaController],
  providers: [NidaService, NidaRepository],
  exports: [NidaService],
})
export class NidaModule {} 