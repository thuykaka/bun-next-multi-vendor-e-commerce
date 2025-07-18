import type { SearchParams } from 'nuqs';
import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { loadProductsSearchParams } from '@/modules/products/params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

type TenantPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

export default async function TenantPage({
  params,
  searchParams
}: TenantPageProps) {
  const { slug } = await params;
  const productsSearchParams = await loadProductsSearchParams(searchParams);

  prefetch(
    trpcServer.products.getMany.infiniteQueryOptions({
      ...productsSearchParams,
      tenantSlug: slug
    })
  );

  return (
    <HydrateClient>
      <ProductListView tenantSlug={slug} />
    </HydrateClient>
  );
}
