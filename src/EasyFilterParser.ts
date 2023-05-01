import { searchParser } from './searchParser/searchParser';
import { addAliases } from './searchParser/tagAliases';
import { ParsedPart } from './types';
import {
  SetupOptions,
  TagAliases,
  OptionalParameters,
} from './typesInternal/exported';

/**
 * EasyFilterParser is a minimal setup parser.
 *
 * The minimal setup is just making a instance.
 *
 * After that, call `search` passing your query string and use the result.
 *
 * @param source - an array of objects
 * @example
 * ```js
  // Minimal example:
  const filter = EasyFilterParser()
  const filteredResult = filter.search('your query')
 * ```
 * @description
 * You can also pass options that will define default behaviors.
 *
 * @example
 * ```js
  // Using All Options:
  const filter = EasyFilterParser({
    filterOptions: {
      dateFormat: 'DD-MM-YYYY',
      normalize: true,
      indexing: true,
      limit: 10,
    },
    tagAliases: {
      tag: ['tag1', 'tag2', 'tag3'],
    }
  })
 * ```
 */
export default function EasyFilterParser({
  filterOptions = {},
  tagAliases = {},
}: OptionalParameters = {}) {
  return {
    /**
     * Call `search` with your query string to filter the source array.
     * @param string - Your query string.
     * @returns the options and the parsed query tree.
     *
     * @see README for everything that can be passed in the query string.
     */
    search: (string: string) => search(string, filterOptions, tagAliases),
  };
}

function search(
  string: string,
  filterOptions: SetupOptions,
  tagAliases: TagAliases,
) {
  const { options, searchTree } = searchParser(string, filterOptions);

  let finalTree: ParsedPart[] = searchTree;

  if (tagAliases !== {}) {
    finalTree = searchTree.map((node) => {
      return addAliases(node, tagAliases);
    });
  }

  return { options, searchTree: finalTree };
}
