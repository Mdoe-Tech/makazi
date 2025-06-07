import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Nida } from './nida.entity';

@Entity('nida_verifications')
export class NidaVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nida_number: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  date_of_birth: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  is_valid: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  match_score: number;

  @Column('jsonb', { nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn()
  verification_date: Date;

  @ManyToOne(() => Nida, { 
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: 'nida_number' })
  nida: Nida;
} 