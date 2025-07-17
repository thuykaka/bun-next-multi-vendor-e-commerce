import { ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { InputDebounce } from '@/components/input-debounce';

type PriceFilterProps = {
  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange: (minPrice: string) => void;
  onMaxPriceChange: (maxPrice: string) => void;
};

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, '');
  const parts = numericValue.split('.');
  const formattedValue =
    parts[0] + (parts.length > 1 ? '.' + parts[1]?.slice(0, 2) : '');

  if (!formattedValue) return '';

  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numberValue);
};

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange
}: PriceFilterProps) {
  const handlePriceChange = (value: string, priceType: 'min' | 'max') => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    priceType === 'min'
      ? onMinPriceChange(numericValue)
      : onMaxPriceChange(numericValue);
  };

  const handleMinPriceChange = (value: string) => {
    handlePriceChange(value, 'min');
  };

  const handleMaxPriceChange = (value: string) => {
    handlePriceChange(value, 'max');
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Min Price</Label>
        <InputDebounce
          type='text'
          className='border-border bg-background placeholder:text-muted-foreground/50'
          placeholder='$0'
          value={minPrice ? formatAsCurrency(minPrice) : ''}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Max Price</Label>
        <InputDebounce
          type='text'
          placeholder='$9999'
          className='border-border bg-background placeholder:text-muted-foreground/50'
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
}
