import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { DocumentRequest } from './entities/document-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTemplate, DocumentRequest])
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {} 