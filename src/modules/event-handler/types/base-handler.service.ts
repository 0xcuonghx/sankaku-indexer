import { EventEmitter2 } from '@nestjs/event-emitter';
import { EnhancedEvent, EnhancedEventsBySubKind } from 'src/types/event.type';
import {
  ActivityLogCreatedEvent,
  EventChannel,
} from 'src/types/internal-event.type';

export class BaseHandlerService {
  protected eventEmitter: EventEmitter2;
  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

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

  createActivityLog(args: ActivityLogCreatedEvent['data'][]) {
    this.eventEmitter.emit(EventChannel.ActivityLogCreated, args);
  }
}