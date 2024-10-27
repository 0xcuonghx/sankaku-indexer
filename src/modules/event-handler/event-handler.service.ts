import { Injectable } from '@nestjs/common';
import { EnhancedEventsByKind } from 'src/types/event.type';
import { ERC20HandlerService } from './handlers/erc20-handler.service';

@Injectable()
export class EventHandlerService {
  constructor(private readonly erc20HandlerService: ERC20HandlerService) {}

  async handleEvents(eventsByKind: EnhancedEventsByKind, backfill = false) {
    for (const kind in eventsByKind) {
      const events = eventsByKind[kind];
      switch (kind) {
        case 'erc20':
          await this.erc20HandlerService.handle(events, backfill);
          break;
      }
    }
  }
}
