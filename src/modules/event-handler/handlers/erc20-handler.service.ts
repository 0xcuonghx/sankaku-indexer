import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';

@Injectable()
export class ERC20HandlerService {
  private readonly logger = new Logger(ERC20HandlerService.name);
  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(
      `Found ${events.length} ERC20 events (backfill: ${backfill})`,
    );
  }
}
