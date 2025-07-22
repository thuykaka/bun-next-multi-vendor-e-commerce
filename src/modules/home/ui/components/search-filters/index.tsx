import Categories from './categories';
import SearchInput from './search-input';

export default function SearchFilters() {
  return (
    <div className='bg-background flex w-full flex-col items-start gap-4 border-b p-4 px-4 lg:px-10'>
      <SearchInput />
      <Categories />
    </div>
  );
}
