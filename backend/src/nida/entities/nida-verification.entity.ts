import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Nida } from './nida.entity';

@Entity('nida_verifications')
export class NidaVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nida_number: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  date_of_birth: string;

  @Column()
  gender: string;

  @Column()
  is_valid: boolean;

  @Column('decimal', { precision: 5, scale: 2 })
  match_score: number;

  @Column('jsonb', { nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn()
  verification_date: Date;

  @ManyToOne(() => Nida)
  @JoinColumn({ name: 'nida_number', referencedColumnName: 'nida_number' })
  nida: Nida;
} 