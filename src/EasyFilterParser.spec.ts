/* eslint-disable @typescript-eslint/no-var-requires */
import EasyFilterParser from './EasyFilterParser';

describe('EasyFilter', () => {
  const ef = EasyFilterParser();

  it('should search a simple search', () => {
    const result = ef.search('bulba');
    expect(result).toEqual({
      options: {},
      searchTree: [{ childs: undefined, mode: 'OR', payload: 'bulba' }],
    });
  });

  it('should search using a quote search', () => {
    const result = ef.search('"saur petal-blizzard"');
    expect(result).toEqual({
      options: {},
      searchTree: [
        {
          childs: [
            { childs: undefined, mode: 'OR', payload: 'saur' },
            { childs: undefined, mode: 'OR', payload: 'petal-blizzard' },
          ],
          mode: 'QUOTE',
          payload: 'saur petal-blizzard',
        },
      ],
    });
  });

  it('should search using tags', () => {
    const result = ef.search('moves.*.move.name:swords-dance');
    expect(result).toEqual({
      options: {},
      searchTree: [
        {
          aliases: {},
          childs: [{ childs: undefined, mode: 'OR', payload: 'swords-dance' }],
          mode: 'TAG',
          payload: 'swords-dance',
          tag: 'moves.*.move.name',
        },
      ],
    });
  });

  it('should search using ranges', () => {
    const result = ef.search('id:range(1,3)');
    expect(result).toEqual({
      options: {},
      searchTree: [
        {
          aliases: {},
          childs: [
            { childs: undefined, mode: 'RANGE', payload: null, range: [1, 3] },
          ],
          mode: 'TAG',
          payload: 'range(1,3)',
          tag: 'id',
        },
      ],
    });
  });

  describe('using options', () => {
    it('should search using limit', () => {
      const result = ef.search('invalidTag:null options(limit:2)');
      expect(result).toEqual({
        options: { limit: 2 },
        searchTree: [
          {
            aliases: {},
            childs: [{ childs: undefined, mode: 'OR', payload: 'null' }],
            mode: 'TAG_NULL',
            payload: 'null',
            tag: 'invalidTag',
          },
        ],
      });
    });

    it('should search using normalization', () => {
      const result = ef.search('sãúr options(normalize)');
      expect(result).toEqual({
        options: { normalize: true },
        searchTree: [{ childs: undefined, mode: 'OR', payload: 'saur' }],
      });
    });

    it('should search using index', () => {
      const result = ef.search('"saur petal-blizzard" options(index)');
      expect(result).toEqual({
        options: { indexing: true },
        searchTree: [
          {
            childs: [
              { childs: undefined, mode: 'OR', payload: 'saur' },
              { childs: undefined, mode: 'OR', payload: 'petal-blizzard' },
            ],
            mode: 'QUOTE',
            payload: 'saur petal-blizzard',
          },
        ],
      });
    });
  });

  describe('using tagAliases', () => {
    const tagAliases = {
      fullTag: ['moves.*.move.name'],
      firstPartTag: ['moves.*'],
      lastPartTag: ['move.name'],
      aliasesWithMultipleValues: ['abilities.*.slot', 'id'],
    };

    it('should search using the aliases for a full tag', () => {
      const efta = EasyFilterParser({ tagAliases });
      const result = efta.search('fullTag:swords-dance');
      expect(result).toEqual({
        options: {},
        searchTree: [
          {
            aliases: { fullTag: ['moves.*.move.name'] },
            childs: [
              { childs: undefined, mode: 'OR', payload: 'swords-dance' },
            ],
            mode: 'TAG',
            payload: 'swords-dance',
            tag: 'fullTag',
          },
        ],
      });
    });

    it('should search using the aliases for a partial tag', () => {
      const efta = EasyFilterParser({ tagAliases });
      const result = efta.search('moves.*.lastPartTag:swords-dance');
      expect(result).toEqual({
        options: {},
        searchTree: [
          {
            aliases: { lastPartTag: ['move.name'] },
            childs: [
              { childs: undefined, mode: 'OR', payload: 'swords-dance' },
            ],
            mode: 'TAG',
            payload: 'swords-dance',
            tag: 'moves.*.lastPartTag',
          },
        ],
      });
    });

    it('should search using multiple aliases', () => {
      const efta = EasyFilterParser({ tagAliases });
      const result = efta.search('firstPartTag.lastPartTag:swords-dance');
      expect(result).toEqual({
        options: {},
        searchTree: [
          {
            aliases: { firstPartTag: ['moves.*'], lastPartTag: ['move.name'] },
            childs: [
              { childs: undefined, mode: 'OR', payload: 'swords-dance' },
            ],
            mode: 'TAG',
            payload: 'swords-dance',
            tag: 'firstPartTag.lastPartTag',
          },
        ],
      });
    });

    it('should search using one aliases with multiple tags', () => {
      const efta = EasyFilterParser({ tagAliases });
      expect(efta.search('aliasesWithMultipleValues:2')).toEqual({
        options: {},
        searchTree: [
          {
            aliases: { aliasesWithMultipleValues: ['abilities.*.slot', 'id'] },
            childs: [{ childs: undefined, mode: 'OR', payload: '2' }],
            mode: 'TAG',
            payload: '2',
            tag: 'aliasesWithMultipleValues',
          },
        ],
      });
      expect(efta.search('aliasesWithMultipleValues:3')).toEqual({
        options: {},
        searchTree: [
          {
            aliases: { aliasesWithMultipleValues: ['abilities.*.slot', 'id'] },
            childs: [{ childs: undefined, mode: 'OR', payload: '3' }],
            mode: 'TAG',
            payload: '3',
            tag: 'aliasesWithMultipleValues',
          },
        ],
      });
    });
  });
});
