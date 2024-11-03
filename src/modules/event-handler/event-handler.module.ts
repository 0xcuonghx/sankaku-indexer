import { Module } from '@nestjs/common';
import { EventHandlerService } from './event-handler.service';
import { ERC20HandlerModule } from './erc20-handler/erc20-handler.module';
import { FactoryHandlerModule } from './factory-handler/factory-handler.module';
import { RecurringExecutorHandlerModule } from './recurring-executor-handler/recurring-executor-handler.module';

@Module({
  imports: [
    ERC20HandlerModule,
    FactoryHandlerModule,
    RecurringExecutorHandlerModule,
  ],
  providers: [EventHandlerService],
  exports: [EventHandlerService],
})
export class EventHandlerModule {}
