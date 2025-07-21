'use client';

import { useCallback, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FilterXIcon,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductFilter } from '@/modules/products/hooks/use-product-filter';
import { Button } from '@/components/ui/button';
import { PriceFilter } from './price-filter';
import { TagsFilter } from './tag-filter';

type FilterSectionProps = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

function FilterSection({ title, className, children }: FilterSectionProps) {
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
  const [filters, setFilters] = useProductFilter();

  const onChange = useCallback(
    (key: keyof typeof filters, value: unknown) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );

  const onClearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      tags: []
    });
  };

  const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
    if (key === 'sort') return false;

    if (typeof value === 'string') {
      return value.trim() !== '';
    } else if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null;
  });

  return (
    <div className='bg-sidebar rounded-md border'>
      <div className='flex items-center justify-between border-b p-4'>
        <h2 className='font-medium'>Filters</h2>
        {hasAnyFilter && (
          <Button size='sm' onClick={onClearFilters} variant='outline'>
            <FilterXIcon className='h-4 w-4' />
            Clear
          </Button>
        )}
      </div>
      <FilterSection title='Price'>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange('minPrice', value)}
          onMaxPriceChange={(value) => onChange('maxPrice', value)}
        />
      </FilterSection>

      <FilterSection title='Tags' className='border-b-0'>
        <TagsFilter
          values={filters.tags}
          onChange={(value) => onChange('tags', value)}
        />
      </FilterSection>
    </div>
  );
}
