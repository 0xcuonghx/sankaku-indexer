import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringExecutorExecuteEventsEntity } from './entities/recurring-executor-execute-events.entity';
import { RecurringExecutorInstallEventsEntity } from './entities/recurring-executor-install-events.entity';
import { RecurringExecutorUninstallEventsEntity } from './entities/recurring-executor-uninstall-events.entity';
import { RecurringExecutorHandlerService } from './recurring-executor-handler.service';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { SubscriptionsModule } from 'src/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecurringExecutorExecuteEventsEntity,
      RecurringExecutorInstallEventsEntity,
      RecurringExecutorUninstallEventsEntity,
    ]),
    BlocksModule,
    SubscriptionsModule,
  ],
  providers: [RecurringExecutorHandlerService],
  exports: [RecurringExecutorHandlerService],
})
export class RecurringExecutorHandlerModule {}