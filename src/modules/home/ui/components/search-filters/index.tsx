import { Category } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import Categories from './categories';
import SearchInput from './search-input';

type SearchFiltersProps = {
  categories: PaginatedDocs<Category>;
};

export default function SearchFilters({ categories }: SearchFiltersProps) {
  return (
    <div className='bg-background flex w-full flex-col items-start gap-4 border-b p-4 px-4 lg:px-8'>
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
}
