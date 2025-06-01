import { IsOptional, IsString, IsEnum } from 'class-validator';
import { VerificationStatus } from '../enums/verification-status.enum';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  file_path?: string;

  @IsOptional()
  @IsString()
  document_type?: string;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verification_status?: VerificationStatus;

  @IsOptional()
  @IsString()
  verification_notes?: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
} 