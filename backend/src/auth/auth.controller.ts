import { Controller, Post, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loggingService: LoggingService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.loggingService.log(`Login attempt for user ${req.user.username}`);
    const result = await this.authService.login(req.user);
    this.loggingService.log(`User ${req.user.username} logged in successfully`);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  async validateToken(@Request() req) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException(swMessages.auth.invalid_token);
      }
      return await this.authService.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException(swMessages.auth.invalid_token);
    }
  }
} 