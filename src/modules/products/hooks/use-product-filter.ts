import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

export const useProductFilter = () => {
  return useQueryStates({
    minPrice: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    }),
    maxPrice: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    })
  });
};
