import { prefetch, HydrateClient, trpcServer } from '@/trpc/server';
import { checkAuth } from '@/lib/payloadcms';
import { LibraryProductView } from '@/modules/library/ui/views/library-product-view';

type LibraryProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function LibraryProductPage({
  params
}: LibraryProductPageProps) {
  await checkAuth();

  const { productId } = await params;

  prefetch(trpcServer.library.getOne.queryOptions({ productId }));

  prefetch(trpcServer.reviews.getOne.queryOptions({ productId }));

  return (
    <HydrateClient
      suspenseFallback={<div>Loading...</div>}
      errorFallback={<div>Error loading library product</div>}
    >
      <LibraryProductView productId={productId} />
    </HydrateClient>
  );
}
