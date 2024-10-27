import { AbiEvent, Log, ParseAbiItem } from 'viem';

export interface EventInterface {
  kind: string;
  subKind: string;
  addresses?: Record<string, boolean>;
  topic: string;
  numberOfTopics: number;
  abi: ParseAbiItem<string>;
}

export interface EnhancedEvent<
  T = Log<bigint, number, false, undefined, undefined, ParseAbiItem<string>[]>,
> {
  kind: string;
  subKind: string;
  log: T;
}

export interface EnhancedEventsByKind {
  [kind: string]: EnhancedEvent[];
}
