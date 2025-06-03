import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VERIFIER = 'VERIFIER',
  VIEWER = 'VIEWER',
  REGISTRAR = 'REGISTRAR',
  APPROVER = 'APPROVER'
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('Roles Guard - User object:', user);
    console.log('Roles Guard - Required roles:', requiredRoles);
    console.log('Roles Guard - User role:', user.role);
    
    const hasRole = requiredRoles.some((role) => user.role?.toUpperCase() === role);
    console.log('Roles Guard - Has required role:', hasRole);
    
    return hasRole;
  }
} 