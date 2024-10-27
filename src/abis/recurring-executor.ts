import { EventInterface } from 'src/types/event.type';
import { parseAbiItem } from 'viem';

export const install: EventInterface = {
  kind: 'recurring-executor',
  subKind: 'install',
  topic: '0x5369136544282e11d41edd771f174aa7dc4ccbe6647c4f7e6d0c09fd62518fff',
  numberOfTopics: 2,
  abi: parseAbiItem(
    'event RecurringExecutionAdded(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)',
  ),
};

export const uninstall: EventInterface = {
  kind: 'recurring-executor',
  subKind: 'uninstall',
  topic: '0xa98648047b7bc937b18b1ed8ef7030d81aca59590c3f8ff2129bff1063513203',
  numberOfTopics: 2,
  abi: parseAbiItem(
    'event RecurringExecutionRemoved(address indexed smartAccount)',
  ),
};

export const execute: EventInterface = {
  kind: 'recurring-executor',
  subKind: 'execute',
  topic: '0x2679a5e414913dc240a41e5cf53862ce94be89e7d22abbaa099182721c552e6f',
  numberOfTopics: 2,
  abi: parseAbiItem(
    'event RecurringExecutionTriggered(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)',
  ),
};
