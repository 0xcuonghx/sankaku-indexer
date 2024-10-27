import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';
import { BaseHandlerService } from './base-handler.service';

@Injectable()
export class ERC20HandlerService extends BaseHandlerService {
  private readonly logger = new Logger(ERC20HandlerService.name);

  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'transfer':
          await this.handleTransfer(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }
  }

  async handleTransfer(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} transfer events (backfill: ${backfill})`,
    );
  }
}
