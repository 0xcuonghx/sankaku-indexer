import { EventInterface } from 'src/types/event.type';
import { getNetworkSettings } from 'src/utils/settings';
import { parseAbiItem } from 'viem';

export const transfer: EventInterface = {
  kind: 'erc20',
  subKind: 'erc20-transfer',
  addresses: getNetworkSettings().supportedCurrencies,
  abi: parseAbiItem(
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ),
};

export default { transfer };
