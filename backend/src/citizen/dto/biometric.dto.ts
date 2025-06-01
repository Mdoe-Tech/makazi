import { IsString, IsNotEmpty, Matches, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class BiometricDataDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9+/=]+$/, { message: 'Fingerprint data inahitaji kuwa katika muundo sahihi' })
  fingerprint_data: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9+/=]+$/, { message: 'Facial data inahitaji kuwa katika muundo sahihi' })
  facial_data: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9+/=]+$/, { message: 'Iris data inahitaji kuwa katika muundo sahihi' })
  iris_data: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  quality_score?: number;
} 