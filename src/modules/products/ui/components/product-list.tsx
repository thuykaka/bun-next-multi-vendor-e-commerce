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

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export function ProductListSkeleton() {
  return <div>Loading products...</div>;
}

export function ProductListError() {
  return <div>Error loading products</div>;
}
