import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ProductFilter } from '@/modules/products/ui/components/product-filter';
import {
  ProductList,
  ProductListError,
  ProductListSkeleton
} from '@/modules/products/ui/components/product-list';
import { ProductSort } from '@/modules/products/ui/components/product-sort';

type ProductListViewProps = {
  category?: string | null;
  tenantSlug?: string | null;
};

export function ProductListView({
  category,
  tenantSlug
}: ProductListViewProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between gap-y-0'>
        <p className='text-foreground text-base font-medium'>Curated for you</p>
        <ProductSort />
      </div>
      <div className='grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-6 xl:grid-cols-8'>
        <div className='lg:col-span-2 xl:col-span-2'>
          <ProductFilter />
        </div>
        <div className='lg:col-span-4 xl:col-span-6'>
          <Suspense fallback={<ProductListSkeleton />}>
            <ErrorBoundary fallback={<ProductListError />}>
              <ProductList category={category} tenantSlug={tenantSlug} />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
