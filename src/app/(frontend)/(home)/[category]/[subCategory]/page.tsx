import type { SearchParams } from 'nuqs';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { loadProductsSearchParams } from '@/modules/products/params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

type SubCategoryPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ subCategory: string }>;
};

export default async function SubCategoryPage({
  params,
  searchParams
}: SubCategoryPageProps) {
  const { subCategory } = await params;
  const productsSearchParams = await loadProductsSearchParams(searchParams);

  prefetch(
    trpcServer.products.getMany.queryOptions({
      category: subCategory,
      ...productsSearchParams
    })
  );

  return (
    <HydrateClient>
      <ProductListView category={subCategory} />
    </HydrateClient>
  );
}
