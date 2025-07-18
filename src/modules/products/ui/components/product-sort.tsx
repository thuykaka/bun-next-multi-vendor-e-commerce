'use client';

import { useProductFilter } from '@/modules/products/hooks/use-product-filter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function ProductSort() {
  const [filters, setFilters] = useProductFilter();

  const handleSort = (sort: 'curated' | 'trending' | 'hot_and_new') => {
    setFilters({ ...filters, sort });
  };

  return (
    <Select
      onValueChange={(value) => {
        handleSort(value as 'curated' | 'trending' | 'hot_and_new');
      }}
      defaultValue={filters.sort}
    >
      <SelectTrigger className='bg-card! w-[180px]'>
        <SelectValue placeholder='Curated' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='curated'>Curated</SelectItem>
        <SelectItem value='trending'>Trending</SelectItem>
        <SelectItem value='hot_and_new'>Hot and New</SelectItem>
      </SelectContent>
    </Select>
  );
}
