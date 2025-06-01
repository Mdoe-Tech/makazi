import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoggingService } from '../logging/logging.service';
import * as bcrypt from 'bcrypt';
import * as swMessages from '../i18n/sw/sw.json';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private loggingService: LoggingService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const admin = await this.adminService.findByUsername(username);
      
      if (!admin) {
        throw new UnauthorizedException(swMessages.auth.invalid_credentials);
      }

      if (!admin.is_active) {
        throw new UnauthorizedException(swMessages.auth.account_inactive);
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException(swMessages.auth.invalid_credentials);
      }

      // Update last login
      await this.adminService.updateLastLogin(
        admin.id,
        'IP_ADDRESS', // TODO: Get actual IP
        'USER_AGENT'  // TODO: Get actual user agent
      );

      const { password: _, ...result } = admin;
      return result;
    } catch (error) {
      this.loggingService.log(`Authentication failed for user ${username}: ${error.message}`);
      throw error;
    }
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      role: user.role,
      permissions: user.permissions
    };

    this.loggingService.log(`User ${user.username} logged in successfully`);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      }
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const admin = await this.adminService.findOne(payload.sub);
      
      if (!admin || !admin.is_active) {
        throw new UnauthorizedException(swMessages.auth.invalid_token);
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException(swMessages.auth.invalid_token);
    }
  }
} 