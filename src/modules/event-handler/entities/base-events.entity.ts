import { Column, PrimaryColumn } from 'typeorm';

export class BaseEventsEntity {
  @PrimaryColumn()
  log_index: number;

  @PrimaryColumn()
  tx_hash: string;

  @PrimaryColumn()
  block_hash: string;

  @Column()
  tx_index: number;

  @Column()
  block: number;

  @Column()
  address: string;
}
