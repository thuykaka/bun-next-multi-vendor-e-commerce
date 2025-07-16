import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import CategoryView from '@/modules/categories/ui/views/category-view';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  prefetch(
    trpcServer.categories.getOne.queryOptions({
      slug: category
    })
  );

  return (
    <HydrateClient
      errorFallback={<div>Error loading category</div>}
      suspenseFallback={<div>Loading category...</div>}
    >
      <CategoryView category={category} />
    </HydrateClient>
  );
}
