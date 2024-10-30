import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'last_sync_block' })
export class LastSyncBlockEntity {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column()
  last_synced_block: number;
}
