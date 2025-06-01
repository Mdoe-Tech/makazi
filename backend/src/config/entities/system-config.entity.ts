import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class SystemConfig extends BaseEntity {
  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  @Column()
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb' })
  metadata: {
    category: string;
    data_type: string;
    validation_rules: any;
    last_modified_by: string;
  };
} 