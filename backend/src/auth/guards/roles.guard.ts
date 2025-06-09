import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // SUPER_ADMIN has access to everything
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // For ADMIN users, check their functional roles
    if (user.role === Role.ADMIN) {
      const hasRole = requiredRoles.some(role => {
        const hasFunctionalRole = user.functional_roles?.includes(role);
        const hasRoleInRoles = user.roles?.includes(role);
        return hasFunctionalRole || hasRoleInRoles;
      });
      return hasRole;
    }

    // For CITIZEN users, only allow CITIZEN role
    if (user.role === Role.CITIZEN) {
      return requiredRoles.includes(Role.CITIZEN);
    }

    return false;
  }
} 