'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import Footer from '@/modules/home/ui/components/footer';
import Logo from '@/modules/home/ui/components/logo';
import ReviewSidebar from '@/modules/library/ui/components/review-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

type LibraryProductViewProps = {
  productId: string;
};

export function LibraryProductView({ productId }: LibraryProductViewProps) {
  const trpc = useTRPC();

  const { data: product } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({ productId })
  );

  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <nav className='bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 px-4 transition-all duration-200 lg:px-10'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-x-12'>
            <Logo
              name='Back to Library'
              className='text-xl!'
              icon={<ArrowLeftIcon className='size-4' />}
              link={'/library'}
            />
          </div>
          <div className='flex items-center gap-x-4'>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className='flex h-16'></div>
      <div className='flex min-h-0 flex-1 flex-col gap-4 p-0 lg:p-4'>
        <header className='py-4'>
          <div className='flex flex-col gap-y-4 px-4'>
            <h3 className='text-2xl font-bold'>{product.name}</h3>
          </div>
        </header>
        <section className='flex flex-col gap-4 px-4'>
          <div className='grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-6 xl:grid-cols-8'>
            <div className='lg:col-span-2 xl:col-span-2'>
              <ReviewSidebar productId={productId} />
            </div>
            <div className='lg:col-span-4 xl:col-span-6'>Content</div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
