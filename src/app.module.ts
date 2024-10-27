import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockScannerModule } from './modules/block-scanner/block-scanner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
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
    BlockScannerModule,
  ],
})
export class AppModule {}
