import { Injectable, Logger } from '@nestjs/common';
import { BaseHandlerService } from './base-handler.service';
import { EnhancedEvent } from 'src/types/event.type';

@Injectable()
export class RecurringExecutorHandlerService extends BaseHandlerService {
  private readonly logger = new Logger(RecurringExecutorHandlerService.name);

  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);
  }
}
