'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductFilter } from '@/modules/products/hooks/use-product-filter';
import { PriceFilter } from './price-filter';

type ProductItemFilterProps = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

function ProductItemFilter({
  title,
  className,
  children
}: ProductItemFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn('flex flex-col gap-2 border-b p-4', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center justify-between'
      >
        <p className='font-medium'>{title}</p>
        <Icon className='h-4 w-4' />
      </div>
      {isOpen && children}
    </div>
  );
}

export function ProductFilter() {
  const [filter, setFilter] = useProductFilter();

  const onChange = (key: keyof typeof filter, value: unknown) => {
    setFilter({ ...filter, [key]: value });
  };

  const onClearFilters = () => {
    setFilter({
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div>
      <div className='rounded-md border bg-white'>
        <div className='flex items-center justify-between border-b p-4'>
          <h2 className='font-medium'>Filters</h2>
          <button className='underline' onClick={onClearFilters} type='button'>
            Clear
          </button>
        </div>
        <ProductItemFilter title='Price' className='border-b-0'>
          <PriceFilter
            minPrice={filter.minPrice}
            maxPrice={filter.maxPrice}
            onMinPriceChange={(value) => onChange('minPrice', value)}
            onMaxPriceChange={(value) => onChange('maxPrice', value)}
          />
        </ProductItemFilter>
      </div>
    </div>
  );
}
