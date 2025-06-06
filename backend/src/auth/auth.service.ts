import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoggingService } from '../logging/logging.service';
import * as bcrypt from 'bcrypt';
import * as swMessages from '../i18n/sw/sw.json';
import { CitizenService } from '../citizen/citizen.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private loggingService: LoggingService,
    private citizenService: CitizenService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      this.loggingService.log(`Attempting to validate user: ${username}`);
      
      const admin = await this.adminService.findByUsername(username);
      
      if (!admin) {
        this.loggingService.log(`User not found: ${username}`);
        throw new UnauthorizedException(swMessages.auth.invalid_credentials);
      }

      if (!admin.is_active) {
        this.loggingService.log(`Inactive account attempt: ${username}`);
        throw new UnauthorizedException(swMessages.auth.account_inactive);
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        this.loggingService.log(`Invalid password for user: ${username}`);
        throw new UnauthorizedException(swMessages.auth.invalid_credentials);
      }

      // Update last login
      await this.adminService.updateLastLogin(
        admin.id,
        'IP_ADDRESS', // TODO: Get actual IP
        'USER_AGENT'  // TODO: Get actual user agent
      );

      const { password: _, ...result } = admin;
      this.loggingService.log(`User validated successfully: ${username}`);
      return result;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        details: error.details || {},
        query: error.query || null
      };
      this.loggingService.error(
        `Authentication failed for user ${username}: ${JSON.stringify(errorDetails)}`,
        error.stack
      );
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

  async validateCitizen(nidaNumber: string, password: string) {
    const citizen = await this.citizenService.findByNidaNumber(nidaNumber);
    if (!citizen) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If citizen doesn't have a password set yet, return special response
    if (!citizen.has_password) {
      return {
        needsPasswordSetup: true,
        citizen: {
          id: citizen.id,
          nida_number: citizen.nida_number,
          first_name: citizen.first_name,
          last_name: citizen.last_name
        }
      };
    }

    // If citizen has password, verify it
    const isPasswordValid = await this.citizenService.verifyPassword(citizen, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      needsPasswordSetup: false,
      citizen
    };
  }
} 