import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
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
    <HydrateClient
      errorFallback={<ProductListError />}
      suspenseFallback={<ProductListSkeleton />}
    >
      <ProductList category={category} />
    </HydrateClient>
  );
}
