import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { NidaService } from './nida.service';
import { NidaData, NidaFilters, VerifyNidaDto } from './types';

@Controller('nida')
export class NidaController {
  constructor(private readonly nidaService: NidaService) {}

  @Post('register')
  async registerNida(@Body() data: Omit<NidaData, 'nida_number'>) {
    return this.nidaService.registerNida(data);
  }

  @Get()
  async getNidaData(@Query() filters: NidaFilters) {
    return this.nidaService.getNidaData(filters);
  }

  @Get(':id')
  async getNidaDataById(@Param('id') id: string) {
    return this.nidaService.getNidaDataById(id);
  }

  @Post('verify')
  async verifyNida(@Body() data: VerifyNidaDto) {
    return this.nidaService.verifyNida(data);
  }

  @Get(':id/verification-history')
  async getNidaVerificationHistory(@Param('id') id: string) {
    return this.nidaService.getNidaVerificationHistory(id);
  }
} 