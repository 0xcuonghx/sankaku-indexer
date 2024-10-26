import { ParseAbiItem } from 'viem';

export interface EventInterface {
  kind: string;
  subKind: string;
  addresses: string[];
  abi: ParseAbiItem<string>;
}
