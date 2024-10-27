import { EventInterface } from 'src/types/event.type';
import { getNetworkSettings } from 'src/utils/settings';
import { parseAbiItem } from 'viem';

export const transfer: EventInterface = {
  kind: 'erc20',
  subKind: 'erc20-transfer',
  addresses: getNetworkSettings().supportedCurrencies,
  topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  numberOfTopics: 3,
  abi: parseAbiItem(
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ),
};

export default { transfer };
