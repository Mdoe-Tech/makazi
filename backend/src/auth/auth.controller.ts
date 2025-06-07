import { Controller, Post, UseGuards, Request, Get, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private jwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const { nida_number, password } = loginDto;
      const validationResult = await this.authService.validateCitizen(nida_number, password);

      // If citizen needs to set up password
      if (validationResult.needsPasswordSetup) {
        return {
          status: 'success',
          data: {
            needsPasswordSetup: true,
            citizen: validationResult.citizen
          }
        };
      }

      // Generate JWT token for regular login
      const payload = { 
        sub: validationResult.citizen.id,
        nida_number: validationResult.citizen.nida_number,
        role: 'CITIZEN'
      };

      return {
        status: 'success',
        data: {
          access_token: this.jwtService.sign(payload),
          citizen: validationResult.citizen
        }
      };
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }

  @Post('admin/login')
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    try {
      const admin = await this.authService.validateUser(adminLoginDto.username, adminLoginDto.password);
      const result = await this.authService.login(admin);
      return {
        status: 'success',
        data: result
      };
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
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