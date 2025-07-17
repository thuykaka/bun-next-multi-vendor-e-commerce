import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    priceType: 'min' | 'max'
  ) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9.]/g, '');
    priceType === 'min'
      ? onMinPriceChange(numericValue)
      : onMaxPriceChange(numericValue);
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Min Price</Label>
        <Input
          type='text'
          className='border-border placeholder:text-muted-foreground/50'
          placeholder='$0'
          value={minPrice ? formatAsCurrency(minPrice) : ''}
          onChange={(e) => handlePriceChange(e, 'min')}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Max Price</Label>
        <Input
          type='text'
          placeholder='$9999'
          className='border-border placeholder:text-muted-foreground/50'
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
          onChange={(e) => handlePriceChange(e, 'max')}
        />
      </div>
    </div>
  );
}
