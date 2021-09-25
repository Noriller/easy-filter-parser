import { TagAliases } from '../typesInternal/exported';
import {
  BaseTypes,
  RangePayload,
  DateRangePayload,
} from '../typesInternal/internal';

/**
 * The base interface for all returns.
 */
export interface ParsedPart {
  payload: string;
  mode: BaseTypes;
  childs?: ParsedPart[];
}

/**
 * Extends `ParsedPart` to add the `range` key.
 */
export interface ParsedRange extends ParsedPart {
  range: RangePayload | DateRangePayload;
}

/**
 * Extends `ParsedPart` to add the `tag` and `aliases` keys.
 */
export interface ParsedTag extends ParsedPart {
  tag: string;
  aliases?: TagAliases;
}
