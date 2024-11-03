import { Injectable } from '@nestjs/common';
import { EnhancedEventsByKind } from 'src/types/event.type';
import { RecurringExecutorHandlerService } from './recurring-executor-handler/recurring-executor-handler.service';
import { ERC20HandlerService } from './erc20-handler/erc20-handler.service';
import { FactoryHandlerService } from './factory-handler/factory-handler.service';

@Injectable()
export class EventHandlerService {
  constructor(
    private readonly erc20HandlerService: ERC20HandlerService,
    private readonly factoryHandlerService: FactoryHandlerService,
    private readonly recurringExecutorHandlerService: RecurringExecutorHandlerService,
  ) {}

  async handleEvents(eventsByKind: EnhancedEventsByKind, backfill = false) {
    for (const kind in eventsByKind) {
      const events = eventsByKind[kind];
      switch (kind) {
        case 'erc20':
          await this.erc20HandlerService.handle(events, backfill);
          break;
        case 'factory':
          await this.factoryHandlerService.handle(events, backfill);
          break;
        case 'recurring-executor':
          await this.recurringExecutorHandlerService.handle(events, backfill);
          break;
        default:
          throw new Error(`Unknown event kind: ${kind}`);
      }
    }
  }
}
