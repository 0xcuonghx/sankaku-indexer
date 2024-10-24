import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockScannerModule } from './modules/block-scanner/block-scanner.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    BlockScannerModule,
  ],
})
export class AppModule {}
