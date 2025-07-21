import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import { Button } from '@/components/ui/button';

type CartButtonProps = {
  tenantSlug: string;
  className?: string;
  productId: string;
  isPurchased: boolean;
};

export function CartButton({
  tenantSlug,
  className,
  productId,
  isPurchased
}: CartButtonProps) {
  const { toggleProductToCart, isProductInCart } = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        className={cn('w-full flex-1', className)}
        variant='default'
        asChild
      >
        <Link href={`/library/${productId}`}>View in Library</Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn('w-full flex-1', className)}
      variant={isProductInCart(productId) ? 'destructive' : 'default'}
      onClick={() => toggleProductToCart(productId)}
    >
      {isProductInCart(productId) ? 'Remove from Cart' : 'Add to Cart'}
    </Button>
  );
}
