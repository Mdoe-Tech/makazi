import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateBiometricDto {
  @IsString()
  @IsNotEmpty()
  biometric_type: string;

  @IsString()
  @IsNotEmpty()
  biometric_data: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  quality_score?: number;

  @IsString()
  @IsOptional()
  capture_device?: string;
} 