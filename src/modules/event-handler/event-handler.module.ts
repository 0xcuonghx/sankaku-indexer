import { Module } from '@nestjs/common';
import { EventHandlerService } from './event-handler.service';
import { ERC20HandlerService } from './handlers/erc20-handler.service';
import { FactoryHandlerService } from './handlers/factory-handler.service';
import { RecurringExecutorHandlerService } from './handlers/recurring-executor-handler.service';

@Module({
  providers: [
    EventHandlerService,
    ERC20HandlerService,
    FactoryHandlerService,
    RecurringExecutorHandlerService,
  ],
  exports: [EventHandlerService],
})
export class EventHandlerModule {}
