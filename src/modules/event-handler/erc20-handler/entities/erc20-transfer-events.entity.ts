import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from '../../types/base-events.entity';

@Entity({ name: 'blockchain_erc20_transfer_events' })
export class ERC20TransferEventsEntity extends BaseEventsEntity {
  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: string;
}
