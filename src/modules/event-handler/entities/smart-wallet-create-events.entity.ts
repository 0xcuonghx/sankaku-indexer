import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from './base-events.entity';

@Entity({ name: 'smart_wallet_create_events' })
export class SmartWalletCreateEventsEntity extends BaseEventsEntity {
  @Column()
  account: string;

  @Column()
  owner: string;

  @Column()
  salt: string;
}
