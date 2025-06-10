import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Raw payload:', payload); // Debug log
    
    // Ensure role is properly set
    const role = payload.role || Role.ADMIN;
    
    const user = { 
      userId: payload.sub, 
      username: payload.username || payload.nida_number,
      role: role,
      roles: [role],
      functional_roles: payload.functional_roles || [],
      permissions: payload.permissions || [],
      citizen_id: payload.citizen_id || payload.sub
    };
    
    console.log('JWT Strategy - Processed user:', user); // Debug log
    return user;
  }
} 