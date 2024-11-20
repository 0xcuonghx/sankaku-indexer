import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blockchain_smart-accounts' })
export class SmartAccountsEntity {
  @PrimaryColumn()
  owner: string;

  @PrimaryColumn()
  account: string;

  @Column()
  salt: string;
}
