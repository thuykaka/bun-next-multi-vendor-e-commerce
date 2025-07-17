'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useProductFilter } from '@/modules/products/hooks/use-product-filter';
import { Skeleton } from '@/components/ui/skeleton';

type ProductListProps = {
  category: string;
};

export function ProductList({ category }: ProductListProps) {
  const [filters] = useProductFilter();
  const trpc = useTRPC();
  const { data, isPending } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  );

  if (isPending) return <ProductListSkeleton />;

  return (
    <div>
      <h2 className='p-4 pt-0 font-medium'>{data?.totalDocs} products found</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {data?.docs?.map((product) => (
          <div key={product.id} className='bg-card rounded-md border p-4'>
            <h2 className='text-xl font-medium'>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: 12 }).map((_, index) => (
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
