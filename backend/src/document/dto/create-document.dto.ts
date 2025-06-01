import { IsEnum, IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../entities/document.entity';
import { VerificationStatus } from '../enums/verification-status.enum';

export class CreateDocumentDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  file_name: string;

  @IsString()
  @IsNotEmpty()
  mime_type: string;

  @IsNumber()
  @IsNotEmpty()
  file_size: number;

  @IsString()
  @IsOptional()
  document_number?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  issue_date?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiry_date?: Date;

  @IsString()
  @IsOptional()
  issuing_authority?: string;

  @IsEnum(VerificationStatus)
  verification_status: VerificationStatus;
}

export class VerifyDocumentDto {
  @IsString()
  @IsNotEmpty()
  verification_notes: string;

  @IsString()
  @IsOptional()
  document_number?: string;

  @IsDate()
  @IsOptional()
  issue_date?: Date;

  @IsDate()
  @IsOptional()
  expiry_date?: Date;

  @IsString()
  @IsOptional()
  issuing_authority?: string;
}

export class RejectDocumentDto {
  @IsString()
  @IsNotEmpty()
  rejection_reason: string;
} 