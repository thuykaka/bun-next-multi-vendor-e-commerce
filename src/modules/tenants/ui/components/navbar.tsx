'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { getTenantUrl } from '@/lib/tenants';
import { cn } from '@/lib/utils';
import Logo from '@/modules/home/ui/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';

type TenantNavbarProps = {
  slug: string;
};

export function TenantNavbar({ slug }: TenantNavbarProps) {
  const trpc = useTRPC();

  const { data: tenant } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({ slug })
  );

  return (
    <nav
      className={cn(
        'bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 px-4 transition-all duration-200 lg:px-10'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-x-12'>
          <Logo
            name={tenant.name}
            className='text-xl!'
            logo={tenant.logo?.url}
            link={getTenantUrl(slug)}
          />
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export function TenantNavbarSkeleton() {
  return (
    <nav className='bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 px-4 transition-all duration-200 lg:px-10'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-x-12'>
          <div className='flex items-center gap-x-4'>
            <Skeleton className='size-[36px] rounded-full' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
      </div>
    </nav>
  );
}
