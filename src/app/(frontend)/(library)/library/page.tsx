import { prefetch, HydrateClient, trpcServer } from '@/trpc/server';
import { LibraryView } from '@/modules/library/ui/views/library-view';

export default async function LibraryPage() {
  prefetch(trpcServer.library.getMany.infiniteQueryOptions({}));

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
}
