import {
  parseAsString,
  parseAsArrayOf,
  useQueryStates,
  parseAsStringLiteral
} from 'nuqs';

export const useProductFilter = () => {
  return useQueryStates({
    search: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    }),
    minPrice: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    }),
    maxPrice: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    }),
    tags: parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      clearOnDefault: true
    }),
    sort: parseAsStringLiteral(['curated', 'trending', 'hot_and_new'])
      .withDefault('curated')
      .withOptions({
        clearOnDefault: true
      })
  });
};
