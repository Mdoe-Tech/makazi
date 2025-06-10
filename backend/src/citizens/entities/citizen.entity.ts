import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('citizens')
export class Citizen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nida_number: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  has_password: boolean;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 