import { IsString } from 'class-validator';
 
export class VerifyDocumentDto {
  @IsString()
  verification_notes: string;
} 