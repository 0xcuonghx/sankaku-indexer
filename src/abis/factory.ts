import { EventInterface } from 'src/types/event.type';
import { parseAbiItem } from 'viem';

export const create: EventInterface = {
  kind: 'factory',
  subKind: 'create',
  topic: '0xf66707ae2820569ece31cb5ac7cfcdd4d076c3f31ed9e28bf94394bedc0f329d',
  numberOfTopics: 4,
  abi: parseAbiItem(
    'event AccountCreated(address indexed account, address indexed owner, bytes32 indexed salt)',
  ),
};

export default { create };
