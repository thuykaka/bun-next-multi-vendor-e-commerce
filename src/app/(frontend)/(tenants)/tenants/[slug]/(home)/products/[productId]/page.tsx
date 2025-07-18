import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import { ProductDetailView } from '@/modules/products/ui/views/product-detail-view';

type ProductPageProps = {
  params: Promise<{ slug: string; productId: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, productId } = await params;

  prefetch(trpcServer.products.getOne.queryOptions({ id: productId }));
  prefetch(trpcServer.tenants.getOne.queryOptions({ slug }));

  return (
    <HydrateClient>
      <ProductDetailView productId={productId} tenantSlug={slug} />
    </HydrateClient>
  );
}
