import { Module } from '@nestjs/common';
import { EventHandlerService } from './event-handler.service';
import { ERC20HandlerService } from './handlers/erc20-handler.service';

@Module({
  providers: [EventHandlerService, ERC20HandlerService],
  exports: [EventHandlerService],
})
export class EventHandlerModule {}
