import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Audit extends BaseEntity {
  @Column()
  action: string;

  @Column()
  entity_type: string;

  @Column()
  entity_id: string;

  @Column({ type: 'jsonb' })
  changes: {
    before: any;
    after: any;
  };

  @Column()
  user_id: string;

  @Column()
  user_type: string;

  @Column({ type: 'jsonb' })
  metadata: {
    ip_address: string;
    user_agent: string;
    timestamp: Date;
  };
} 