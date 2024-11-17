import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringExecutorExecuteEventsEntity } from './entities/recurring-executor-execute-events.entity';
import { RecurringExecutorInstallEventsEntity } from './entities/recurring-executor-install-events.entity';
import { RecurringExecutorUninstallEventsEntity } from './entities/recurring-executor-uninstall-events.entity';
import { RecurringExecutorHandlerService } from './recurring-executor-handler.service';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { InsertActivityLogModule } from 'src/modules/jobs/insert-activity-log/insert-activity-log.module';
import { InitialChargeModule } from 'src/modules/jobs/initial-charge/initial-charge.module';
import { SubscriptionsFetcherModule } from 'src/modules/jobs/subscriptions-fetcher/subscriptions-fetcher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecurringExecutorExecuteEventsEntity,
      RecurringExecutorInstallEventsEntity,
      RecurringExecutorUninstallEventsEntity,
    ]),
    BlocksModule,
    InsertActivityLogModule,
    InitialChargeModule,
    SubscriptionsFetcherModule,
  ],
  providers: [RecurringExecutorHandlerService],
  exports: [RecurringExecutorHandlerService],
})
export class RecurringExecutorHandlerModule {}
