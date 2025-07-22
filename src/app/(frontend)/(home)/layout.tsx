import { HydrateClient, prefetch, trpcServer } from '@/trpc/server';
import Footer from '@/modules/home/ui/components/footer';
import Navbar from '@/modules/home/ui/components/navbar';
import SearchFilters from '@/modules/home/ui/components/search-filters';

export default async function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  prefetch(trpcServer.categories.getMany.queryOptions());

  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <Navbar />
      <HydrateClient
        suspenseFallback={<div>Loading...</div>}
        errorFallback={<div>Error</div>}
      >
        <SearchFilters />
      </HydrateClient>
      <div className='flex min-h-0 flex-1 flex-col gap-4 p-4 lg:px-10'>
        {children}
      </div>
      <Footer />
    </main>
  );
}
