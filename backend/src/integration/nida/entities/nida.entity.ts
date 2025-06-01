import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class Nida extends BaseEntity {
  @Column({ unique: true })
  nida_number: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  date_of_birth: Date;

  @Column()
  gender: string;

  @Column()
  nationality: string;

  @Column({ type: 'jsonb' })
  address: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };

  @Column({ type: 'jsonb' })
  biometric_data: {
    fingerprint: string;
    facial_image: string;
    iris_scan: string;
  };

  @Column({ type: 'jsonb' })
  metadata: {
    registration_date: Date;
    last_updated: Date;
    status: string;
    verification_status: string;
  };
} 