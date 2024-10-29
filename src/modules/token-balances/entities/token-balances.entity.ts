import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'token_balances' })
export class TokenBalancesEntity {
  @PrimaryColumn()
  account: string;

  @PrimaryColumn()
  token: string;

  @Column()
  balance: string;
}
