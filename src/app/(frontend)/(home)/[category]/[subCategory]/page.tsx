import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import {
  ProductListError,
  ProductList,
  ProductListSkeleton
} from '@/modules/products/ui/components/product-list';

type CategoryPageProps = {
  params: Promise<{ subCategory: string }>;
};

export default async function SubCategoryPage({ params }: CategoryPageProps) {
  const { subCategory } = await params;

  prefetch(trpcServer.products.getMany.queryOptions({ category: subCategory }));

  return (
    <HydrateClient
      errorFallback={<ProductListError />}
      suspenseFallback={<ProductListSkeleton />}
    >
      <ProductList category={subCategory} />
    </HydrateClient>
  );
}
