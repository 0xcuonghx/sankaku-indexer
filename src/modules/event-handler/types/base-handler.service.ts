import { EnhancedEvent, EnhancedEventsBySubKind } from 'src/types/event.type';

export class BaseHandlerService {
  async handle(events: EnhancedEvent[], backfill = false) {
    throw new Error('Method not implemented.');
  }

  batchEventsBySubKind(
    enhancedEvents: EnhancedEvent[],
  ): EnhancedEventsBySubKind {
    return enhancedEvents.reduce((eventsBySubKind, event) => {
      if (!eventsBySubKind[event.subKind]) {
        eventsBySubKind[event.subKind] = [];
      }
      eventsBySubKind[event.subKind].push(event);
      return eventsBySubKind;
    }, {});
  }
}
