'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

type CategoryViewProps = {
  category: string;
};

export default function CategoryView({ category }: CategoryViewProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.categories.getOne.queryOptions({
      slug: category
    })
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
