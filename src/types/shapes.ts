import { FilterOptions, TagAliases } from './exported';

export interface ParsedPart {
  payload: string;
  mode: BaseTypes;
  childs?: ParsedPart[];
}

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

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedOptions {
  search: string;
  parsedOptions: FilterOptions;
}

export interface ParsedRange extends ParsedPart {
  range: RangePayload | DateRangePayload;
}

export interface ParsedTag extends ParsedPart {
  tag: string;
  aliases?: TagAliases;
}

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];

export type NOT_Exclusion = 'NOT_Exclusion';