import { cn } from '@/lib/utils';
import { useHydration } from '@/hooks/use-hydration';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import { Button } from '@/components/ui/button';

type CartButtonProps = {
  tenantSlug: string;
  className?: string;
  productId: string;
};

export function CartButton({
  tenantSlug,
  className,
  productId
}: CartButtonProps) {
  const cart = useCart(tenantSlug);
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <CartButtonSkeleton />;
  }

  const buttonText = cart.isProductInCart(productId)
    ? 'Remove from Cart'
    : 'Add to Cart';

  return (
    <Button
      className={cn('w-full flex-1', className)}
      variant={cart.isProductInCart(productId) ? 'destructive' : 'default'}
      onClick={() => cart.toggleProductInCart(productId)}
    >
      {buttonText}
    </Button>
  );
}

export function CartButtonSkeleton() {
  return (
    <Button className='w-full flex-1' variant='default' disabled>
      Add to Cart
    </Button>
  );
}
