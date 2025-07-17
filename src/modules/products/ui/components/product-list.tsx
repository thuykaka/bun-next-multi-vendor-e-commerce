'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

type ProductListProps = {
  category: string;
};

export function ProductList({ category }: ProductListProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category })
  );

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {data?.docs?.map((product) => (
        <div key={product.id} className='rounded-md border bg-white p-4'>
          <h2 className='text-xl font-medium'>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton() {
  return <div>Loading products...</div>;
}

export function ProductListError() {
  return <div>Error loading products</div>;
}
