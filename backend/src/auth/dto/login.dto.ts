import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  nida_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 