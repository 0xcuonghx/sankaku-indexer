import { Injectable, Logger } from '@nestjs/common';
import { BaseHandlerService } from './base-handler.service';
import { EnhancedEvent } from 'src/types/event.type';

@Injectable()
export class RecurringExecutorHandlerService extends BaseHandlerService {
  private readonly logger = new Logger(RecurringExecutorHandlerService.name);

  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'install':
          await this.handleInstall(subKindEvents, backfill);
          break;
        case 'uninstall':
          await this.handleUninstall(subKindEvents, backfill);
          break;
        case 'execute':
          await this.handleExecute(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }
  }

  async handleInstall(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} install events (backfill: ${backfill})`,
    );
  }

  async handleUninstall(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} uninstall events (backfill: ${backfill})`,
    );
  }

  async handleExecute(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} uninstall events (backfill: ${backfill})`,
    );
  }
}
