import { cn } from '@/lib/utils';
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

  return (
    <Button
      className={cn('w-full flex-1', className)}
      variant='default'
      onClick={() => cart.updateProductToCart(productId, 1)}
    >
      Add to Cart
    </Button>
  );
}
