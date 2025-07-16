import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Categories from './categories';
import SearchInput from './search-input';

export default function SearchFilters() {
  return (
    <div className='bg-background flex w-full flex-col items-start gap-4 border-b p-4 px-4 lg:px-10'>
      <SearchInput />
      <Suspense fallback={<div>Loading categories...</div>}>
        <ErrorBoundary fallback={<div>Error loading categories...</div>}>
          <Categories />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
