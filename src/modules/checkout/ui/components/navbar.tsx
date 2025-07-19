import { StoreIcon } from 'lucide-react';
import Link from 'next/link';
import { getTenantUrl } from '@/lib/tenants';
import { cn } from '@/lib/utils';
import Logo from '@/modules/home/ui/components/logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

type TenantNavbarProps = {
  slug: string;
};

export function CheckoutNavbar({ slug }: TenantNavbarProps) {
  return (
    <nav
      className={cn(
        'bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 px-4 transition-all duration-200 lg:px-10'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-x-12'>
          <Logo name='Checkout' className='text-xl!' />
        </div>
        <div className='flex items-center gap-x-4'>
          <Button variant='outline' asChild>
            <Link href={getTenantUrl(slug)}>
              <StoreIcon className='size-4' />
              Continue Shopping
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
