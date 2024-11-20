import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blockchain_token_balances' })
export class TokenBalancesEntity {
  @PrimaryColumn()
  account: string;

  @PrimaryColumn()
  token: string;

  @Column()
  balance: string;
}
