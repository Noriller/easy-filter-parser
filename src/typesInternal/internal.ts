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

export type NOT_Exclusion = 'NOT_Exclusion';

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedOptions {
  search: string;
  parsedOptions: FilterOptions;
}
