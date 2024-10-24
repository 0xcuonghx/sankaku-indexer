import { Module } from '@nestjs/common';
import { RealtimeSyncService } from './realtime-sync.service';

@Module({ providers: [RealtimeSyncService], exports: [RealtimeSyncService] })
export class RealtimeSyncModule {}
