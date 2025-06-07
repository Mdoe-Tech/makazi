import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class CreateDocumentRequestDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  purpose: string;
} 