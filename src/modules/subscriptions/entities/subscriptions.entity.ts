import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum SubscriptionBasis {
  Weekly = 'weekly',
  Monthly = 'monthly',
  SixMonthly = 'six-monthly',
}

export enum SubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
  Expired = 'expired',
}

export enum SubscriptionReason {
  InsufficientFunds = 'insufficient-funds',
  Unsubscribed = 'unsubscribed',
}

export enum SubscriptionType {
  Plus = 'plus',
  Infinite = 'infinite',
}

@Entity({ name: 'subscriptions' })
export class SubscriptionsEntity {
  @PrimaryColumn()
  account: string;

  @Column()
  planId: number;

  @Column()
  last_execution_timestamp: number;

  @Column()
  next_execution_timestamp: number;

  @Column({
    type: 'enum',
    enum: SubscriptionBasis,
    default: SubscriptionBasis.Weekly,
  })
  basis: SubscriptionBasis;

  @Column()
  receiver: string;

  @Column()
  token: string;

  @Column()
  amount: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.Active,
  })
  status: SubscriptionStatus;

  @Column({ type: 'enum', enum: SubscriptionReason, nullable: true })
  reason: SubscriptionReason;

  @Column({ type: 'enum', enum: SubscriptionType })
  type: SubscriptionType;
}
