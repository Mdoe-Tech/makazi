import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, MinLength, Matches } from 'class-validator';
import { Role } from '../../auth/guards/roles.guard';

export class CreateAdminDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+255[0-9]{9}$/, { message: 'Phone number must start with +255 followed by 9 digits' })
  phone_number?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  permissions?: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
}

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+255[0-9]{9}$/, { message: 'Phone number must start with +255 followed by 9 digits' })
  phone_number?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  permissions?: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
} 