import { Module } from '@nestjs/common';
import { NidaController } from './nida.controller';
import { NidaService } from './nida.service';
import { LoggingModule } from '../../logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [NidaController],
  providers: [NidaService],
  exports: [NidaService]
})
export class NidaModule {} 