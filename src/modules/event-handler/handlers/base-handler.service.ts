import { EnhancedEvent } from 'src/types/event.type';

export class BaseHandlerService {
  async handle(events: EnhancedEvent[], backfill = false) {
    throw new Error('Method not implemented.');
  }
}
