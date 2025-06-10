import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  username?: string;
  nida_number?: string;
  password: string;
} 