import { Controller, Get, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { GetSubscriptionsDto } from './dtos/get-subscriptions.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async getSubscriptions(@Query() args: GetSubscriptionsDto) {
    return this.subscriptionsService.getSubscriptions(args);
  }
}
