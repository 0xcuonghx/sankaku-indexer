import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blocks' })
export class BlockEntity {
  @PrimaryColumn()
  hash: string;

  @PrimaryColumn()
  block: number;

  @Column()
  timestamp: number;
}
