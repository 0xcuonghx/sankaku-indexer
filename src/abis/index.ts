import * as erc20 from './erc20';
import * as factory from './factory';
import * as recurringExecutor from './recurring-executor';

export const getEventInterfaces = () => [
  erc20.transfer,
  factory.create,
  recurringExecutor.install,
  recurringExecutor.uninstall,
  recurringExecutor.execute,
];
