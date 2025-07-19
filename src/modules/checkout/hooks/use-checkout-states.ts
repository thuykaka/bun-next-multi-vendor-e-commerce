import { useQueryStates, parseAsBoolean } from 'nuqs';

export const useCheckoutStates = () => {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true
    })
  });
};
