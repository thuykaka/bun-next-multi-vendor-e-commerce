import { Suspense } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import Footer from '@/modules/home/ui/components/footer';
import Logo from '@/modules/home/ui/components/logo';
import {
  LibraryProductList,
  LibraryProductListError,
  LibraryProductListSkeleton
} from '@/modules/library/ui/components/library-product-list';
import { ThemeToggle } from '@/components/theme-toggle';

export function LibraryView() {
  return (
    <main className='flex min-h-screen w-full flex-col overflow-y-auto'>
      <nav className='bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 px-4 transition-all duration-200 lg:px-10'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-x-12'>
            <Logo
              name='Continue Shopping'
              className='text-xl!'
              icon={<ArrowLeftIcon className='size-4' />}
              link={'/'}
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
            <h3 className='text-2xl font-bold'>My Library</h3>
            <p className='text-foreground text-base font-medium'>
              Your purchased products and reviews.
            </p>
          </div>
        </header>
        <section className='flex flex-col gap-4 px-4'>
          <Suspense fallback={<LibraryProductListSkeleton />}>
            <ErrorBoundary fallback={<LibraryProductListError />}>
              <LibraryProductList />
            </ErrorBoundary>
          </Suspense>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export function LibraryViewSkeleton() {
  return <div>Loading...</div>;
}

export function LibraryViewError() {
  return <div>Error loading library</div>;
}
