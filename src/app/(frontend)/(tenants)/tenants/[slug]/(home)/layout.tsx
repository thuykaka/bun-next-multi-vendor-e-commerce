import { prefetch, trpcServer, HydrateClient } from '@/trpc/server';
import Footer from '@/modules/home/ui/components/footer';
import {
  TenantNavbar,
  TenantNavbarSkeleton
} from '@/modules/tenants/ui/components/navbar';

export default async function TenantHomeLayout({
  params,
  children
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  prefetch(trpcServer.tenants.getOne.queryOptions({ slug }));

  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <HydrateClient
        suspenseFallback={<TenantNavbarSkeleton />}
        errorFallback={<div>Error loading tenant</div>}
      >
        <TenantNavbar slug={slug} />
      </HydrateClient>
      <div className='flex h-16'></div>
      <div className='flex min-h-0 flex-1 flex-col gap-4 p-4 lg:px-10'>
        {children}
      </div>
      <Footer />
    </main>
  );
}
