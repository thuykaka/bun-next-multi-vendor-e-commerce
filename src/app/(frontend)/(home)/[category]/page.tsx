import type { SearchParams } from 'nuqs';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { loadProductsSearchParams } from '@/modules/products/params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

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
    trpcServer.products.getMany.infiniteQueryOptions({
      category,
      ...productsSearchParams
    })
  );

  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  );
}
