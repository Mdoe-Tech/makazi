import { IsString } from 'class-validator';
 
export class RejectDocumentDto {
  @IsString()
  rejection_reason: string;
} 