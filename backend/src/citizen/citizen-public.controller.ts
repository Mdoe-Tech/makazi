import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { LoggingService } from '../logging/logging.service';

@Controller('citizen')
export class CitizenPublicController {
  constructor(
    private readonly citizenService: CitizenService,
    private readonly loggingService: LoggingService
  ) {}

  @Get('verify/:nidaNumber')
  async verifyNidaNumber(@Param('nidaNumber') nidaNumber: string) {
    this.loggingService.log(
      `Verifying NIDA number: ${nidaNumber}`,
      'Citizen'
    );
    try {
      const result = await this.citizenService.verifyNidaNumber(nidaNumber);
      this.loggingService.log(
        `NIDA verification result for ${nidaNumber}: exists=${result.exists}, hasPassword=${result.hasPassword}`,
        'Citizen'
      );
      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      this.loggingService.error(
        `Error verifying NIDA number: ${nidaNumber}: ${error.message}`,
        'Citizen'
      );
      throw new InternalServerErrorException('Error verifying NIDA number');
    }
  }

  @Post(':nida_number/password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async setInitialPassword(
    @Param('nida_number') nidaNumber: string,
    @Body() body: { password: string }
  ) {
    this.loggingService.log(
      `Setting initial password for NIDA: ${nidaNumber}`,
      'Citizen'
    );
    try {
      if (!body || !body.password) {
        this.loggingService.error(
          `Password is required for NIDA: ${nidaNumber}`,
          'Citizen'
        );
        throw new BadRequestException('Password is required');
      }

      this.loggingService.log(
        `Received password request for NIDA: ${nidaNumber}`,
        'Citizen'
      );

      const result = await this.citizenService.setInitialPassword(nidaNumber, body.password);
      
      this.loggingService.log(
        `Successfully set password for NIDA: ${nidaNumber}`,
        'Citizen'
      );

      return { 
        status: 'success', 
        data: { 
          message: 'Password set successfully. Please login with your NIDA number and password.',
          redirectTo: '/citizen/login'
        } 
      };
    } catch (error) {
      this.loggingService.error(
        `Error setting password for NIDA: ${nidaNumber}: ${error.message}`,
        'Citizen'
      );
      throw error;
    }
  }
} 