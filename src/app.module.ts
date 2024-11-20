import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockScannerModule } from './modules/jobs/block-scanner/block-scanner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
import { DailyChargeModule } from './modules/jobs/daily-charge/daily-charge.module';

@Module({
  imports: [
    // Third-party modules
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
          db: configService.get('REDIS_DB'),
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
          db: configService.get('REDIS_DB'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    // Cron Job Modules
    BlockScannerModule,
    DailyChargeModule,

    // API Modules
    ActivityLogsModule,
    SmartAccountsModule,
    SubscriptionsModule,
    TokenBalancesModule,
  ],
})
export class AppModule {}
