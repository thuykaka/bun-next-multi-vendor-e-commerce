import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { getTenantUrl } from '@/lib/tenants';
import { cn } from '@/lib/utils';
import { useHydration } from '@/hooks/use-hydration';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import { Button } from '@/components/ui/button';

type CheckoutButtonProps = {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
};

export function CheckoutButton({
  tenantSlug,
  hideIfEmpty = false,
  className
}: CheckoutButtonProps) {
  const { totalItems } = useCart(tenantSlug);
  const isHydration = useHydration();

  if (!isHydration) {
    return <CheckoutButtonSkeleton />;
  }

  if (hideIfEmpty && totalItems === 0) {
    return null;
  }

  return (
    <Button className={cn(className)} variant='outline' asChild>
      <Link href={`${getTenantUrl(tenantSlug)}/checkout`}>
        <ShoppingCartIcon className='size-4' />
        {totalItems > 0 ? totalItems : ''}
      </Link>
    </Button>
  );
}

export function CheckoutButtonSkeleton() {
  return (
    <Button variant='outline' disabled>
      <ShoppingCartIcon className='size-4' />
    </Button>
  );
}
