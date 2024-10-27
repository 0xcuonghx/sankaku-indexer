import { Injectable, Logger } from '@nestjs/common';
import { BaseHandlerService } from './base-handler.service';
import { EnhancedEvent } from 'src/types/event.type';

@Injectable()
export class FactoryHandlerService extends BaseHandlerService {
  private readonly logger = new Logger(FactoryHandlerService.name);

  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'create':
          await this.handleCreate(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }
  }

  async handleCreate(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} create events (backfill: ${backfill})`,
    );
  }
}
