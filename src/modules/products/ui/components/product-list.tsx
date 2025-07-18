'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import type { Media, Tenant } from '@/payload-types';
import { InboxIcon, Loader2Icon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants/biz';
import { useProductFilter } from '@/modules/products/hooks/use-product-filter';
import { ProductCard } from '@/modules/products/ui/components/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type ProductListProps = {
  category?: string | null;
  tenantSlug?: string | null;
};

export function ProductList({ category, tenantSlug }: ProductListProps) {
  const [filters] = useProductFilter();
  const trpc = useTRPC();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        { category, tenantSlug, ...filters },
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined
        }
      )
    );

  if (data?.pages?.[0]?.docs.length === 0) {
    return (
      <div className='border-card bg-card flex min-h-[300px] w-full flex-col items-center justify-center gap-y-4 rounded-md border p-8 lg:min-h-[500px]'>
        <InboxIcon />
        <p className='text-base font-medium'>No products found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='p-4 pt-0 font-medium'>
        {data?.pages?.[0]?.totalDocs} products found
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {data?.pages
          ?.flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.images?.[0]?.url}
              authorSlug={product.tenant.slug}
              authorName={product.tenant.name}
              authorAvatarUrl={product.tenant.logo?.url}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          ))}
      </div>
      {hasNextPage && (
        <div className='flex items-center justify-center pt-8'>
          <Button
            variant='outline'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            size='sm'
          >
            {isFetchingNextPage && (
              <Loader2Icon className='size-4 animate-spin' />
            )}
            Load more...
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: Math.min(DEFAULT_LIMIT, 12) }).map((_, index) => (
        <div
          key={index}
          className='bg-card flex flex-col gap-2 rounded-md border p-4'
        >
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
        </div>
      ))}
    </div>
  );
}

export function ProductListError() {
  return <div>Error loading products</div>;
}
