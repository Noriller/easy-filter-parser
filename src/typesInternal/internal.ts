import { FilterOptions } from './exported';
import { ParsedPart } from '../types';

export type BaseTypes =
  | 'NOT'
  | 'OPTION'
  | 'QUOTE'
  | 'TAG'
  | 'TAG_NULL'
  | 'RANGE'
  | 'DATE_RANGE'
  | 'OR';

export type AllTypes = BaseTypes | 'INITIAL';

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedOptions {
  search: string;
  parsedOptions: FilterOptions;
}
