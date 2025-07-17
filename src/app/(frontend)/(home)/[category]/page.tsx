import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { ProductFilter } from '@/modules/products/ui/components/product-filter';
import {
  ProductList,
  ProductListError,
  ProductListSkeleton
} from '@/modules/products/ui/components/product-list';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  prefetch(trpcServer.products.getMany.queryOptions({ category }));

  return (
    <HydrateClient>
      <div className='grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8'>
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
    </HydrateClient>
  );
}
