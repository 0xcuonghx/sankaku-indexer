import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blocks' })
export class BlocksEntity {
  @PrimaryColumn()
  hash: string;

  @PrimaryColumn()
  block: number;

  @Column()
  timestamp: number;
}
