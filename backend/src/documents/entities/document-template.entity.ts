import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';

@Entity('document_templates')
export class DocumentTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  type: DocumentType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  required_fields: string[];

  @Column()
  processing_time: string;

  @Column('decimal', { precision: 10, scale: 2 })
  fee: number;

  @Column('text', { nullable: true })
  template_content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 