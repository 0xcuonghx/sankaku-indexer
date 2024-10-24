import { Module } from '@nestjs/common';
import { BackfillSyncService } from './backfill-sync.service';

@Module({ providers: [BackfillSyncService], exports: [BackfillSyncService] })
export class BackfillSyncModule {}
