import { prefetch, HydrateClient, trpcServer } from '@/trpc/server';
import { checkAuth } from '@/lib/payloadcms';
import { LibraryView } from '@/modules/library/ui/views/library-view';

export default async function LibraryPage() {
  await checkAuth();

  prefetch(trpcServer.library.getMany.infiniteQueryOptions({}));

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
}
