import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockScannerModule } from './modules/block-scanner/block-scanner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChargeModule } from './modules/charge/charge.module';
import { validate } from './config/env.validation';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { SmartAccountsModule } from './modules/smart-accounts/smart-accounts.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TokenBalancesModule } from './modules/token-balances/token-balances.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('POSTGRES_URL'),
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        });
        return {
          store,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BlockScannerModule,
    ChargeModule,
    SmartAccountsModule,
    SubscriptionsModule,
    TokenBalancesModule,
    ActivityLogsModule,
  ],
})
export class AppModule {}
