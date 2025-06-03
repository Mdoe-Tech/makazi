import { IsEnum, IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { LetterType } from '../entities/letter.entity';

export class CreateLetterDto {
  @IsEnum(LetterType)
  @IsNotEmpty()
  letter_type: LetterType;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  additional_info?: string;
}

export class ApproveLetterDto {
  @IsString()
  @IsNotEmpty()
  approval_notes: string;
}

export class RejectLetterDto {
  @IsString()
  @IsNotEmpty()
  rejection_reason: string;
} 