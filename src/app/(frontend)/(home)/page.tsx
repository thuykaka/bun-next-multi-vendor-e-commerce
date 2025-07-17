import type { SearchParams } from 'nuqs';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { loadProductsSearchParams } from '@/modules/products/params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

type CategoryPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CategoryPage({
  searchParams
}: CategoryPageProps) {
  const productsSearchParams = await loadProductsSearchParams(searchParams);

  prefetch(
    trpcServer.products.getMany.infiniteQueryOptions({
      ...productsSearchParams
    })
  );

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
}
