import { Log, ParseAbiItem } from 'viem';

export interface EventInterface {
  kind: string;
  subKind: string;
  addresses?: Record<string, boolean>;
  topic: string;
  numberOfTopics: number;
  abi: ParseAbiItem<string>;
}

export interface EnhancedEvent<
  T extends string | readonly string[] | readonly unknown[] = any,
> {
  kind: string;
  subKind: string;
  log: Log<bigint, number, false, undefined, undefined, ParseAbiItem<T>[]>;
}

export interface EnhancedEventsByKind {
  [kind: string]: EnhancedEvent[];
}

export interface EnhancedEventsBySubKind {
  [kind: string]: EnhancedEvent[];
}
