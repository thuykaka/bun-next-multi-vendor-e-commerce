export const formatPriceCurrency = (
  price: number | string,
  currency: string = 'USD'
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(price));
};
