import { Suspense } from 'react';
import type { SearchParams } from 'nuqs';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { loadProductsSearchParams } from '@/modules/products/params';
import { ProductFilter } from '@/modules/products/ui/components/product-filter';
import {
  ProductList,
  ProductListError,
  ProductListSkeleton
} from '@/modules/products/ui/components/product-list';
import { ProductSort } from '@/modules/products/ui/components/product-sort';

type CategoryPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({
  params,
  searchParams
}: CategoryPageProps) {
  const { category } = await params;
  const productsSearchParams = await loadProductsSearchParams(searchParams);

  prefetch(
    trpcServer.products.getMany.queryOptions({
      category,
      ...productsSearchParams
    })
  );

  return (
    <HydrateClient>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between lg:gap-y-0'>
          <p className='text-xl font-medium'>Curated for you</p>
          <ProductSort />
        </div>
        <div className='grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-6 xl:grid-cols-8'>
          <div className='lg:col-span-2 xl:col-span-2'>
            <ProductFilter />
          </div>
          <div className='lg:col-span-4 xl:col-span-6'>
            <Suspense fallback={<ProductListSkeleton />}>
              <ErrorBoundary fallback={<ProductListError />}>
                <ProductList category={category} />
              </ErrorBoundary>
            </Suspense>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
