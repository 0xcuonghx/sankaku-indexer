import { Module } from '@nestjs/common';
import { EventHandlerService } from './event-handler.service';
import { ERC20HandlerService } from './handlers/erc20-handler.service';
import { FactoryHandlerService } from './handlers/factory-handler.service';
import { RecurringExecutorHandlerService } from './handlers/recurring-executor-handler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERC20TransferEventsEntity } from './entities/erc20-transfer-events.entity';
import { RecurringExecutorInstallEventsEntity } from './entities/recurring-executor-install.entity';
import { RecurringExecutorUninstallEventsEntity } from './entities/recurring-executor-uninstall.entity';
import { RecurringExecutorExecuteEventsEntity } from './entities/recurring-executor-execute.entity';
import { SmartWalletCreateEventsEntity } from './entities/smart-wallet-create-events.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ERC20TransferEventsEntity,
      RecurringExecutorInstallEventsEntity,
      RecurringExecutorUninstallEventsEntity,
      RecurringExecutorExecuteEventsEntity,
      SmartWalletCreateEventsEntity,
    ]),
  ],
  providers: [
    EventHandlerService,
    ERC20HandlerService,
    FactoryHandlerService,
    RecurringExecutorHandlerService,
  ],
  exports: [EventHandlerService],
})
export class EventHandlerModule {}
