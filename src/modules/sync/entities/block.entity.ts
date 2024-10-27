import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blocks' })
export class BlockEntity {
  @PrimaryColumn()
  block: number;

  @Column()
  timestamp: number;
}
