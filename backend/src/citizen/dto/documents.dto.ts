import { IsString, IsOptional, IsObject } from 'class-validator';

export class DocumentsDto {
  @IsString()
  @IsOptional()
  national_id?: string;

  @IsString()
  @IsOptional()
  birth_certificate?: string;

  @IsString()
  @IsOptional()
  passport?: string;

  @IsString()
  @IsOptional()
  driving_license?: string;

  @IsObject()
  @IsOptional()
  other_documents?: Record<string, string>;
} 