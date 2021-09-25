/* eslint-disable prettier/prettier */
import { ParsedPart } from '../../types';
import { ParsedResult } from "../../typesInternal/internal";
import { cleanString } from '../../utils/cleanString';

export function orParse(search: string): ParsedResult {
  const orParsed = cleanString(search).split(' ').filter(Boolean);

  if (orParsed.length > 0) {
    return {
      search: null,
      parsedSearch: orParsed.map((payload): ParsedPart => ({ payload, mode: 'OR' }))
    };
  }

  return null;
}
