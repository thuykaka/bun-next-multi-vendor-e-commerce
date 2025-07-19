'use client';

import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { getTenantUrl } from '@/lib/tenants';
import { useHydration } from '@/hooks/use-hydration';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import { useCheckoutStates } from '@/modules/checkout/hooks/use-checkout-states';
import {
  CartItem,
  CartItemSkeleton
} from '@/modules/checkout/ui/components/cart-item';
import {
  CheckoutSidebar,
  CheckoutSidebarSkeleton
} from '@/modules/checkout/ui/components/checkout-sidebar';
import { Skeleton } from '@/components/ui/skeleton';

type CheckoutViewProps = {
  slug: string;
};

export default function CheckoutView({ slug }: CheckoutViewProps) {
  const router = useRouter();
  const isHydration = useHydration();
  const [checkoutState, setCheckoutState] = useCheckoutStates();

  const trpc = useTRPC();

  const {
    totalItems,
    cartItems,
    clearCart,
    updateProductToCart,
    removeProductFromCart
  } = useCart(slug);

  const {
    data: products,
    error,
    isPending
  } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      productIds: Object.keys(cartItems)
    })
  );

  const setCheckoutStateToDefault = () => {
    setCheckoutState({
      success: false,
      cancel: false
    });
  };

  const { mutate: purchase, isPending: isPurchasePending } = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setCheckoutStateToDefault();
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === 'UNAUTHORIZED') {
          router.push('/sign-in');
        }
      }
    })
  );

  useEffect(() => {
    if (error && error.data?.code === 'NOT_FOUND') {
      toast.warning('Some products not found, cart cleared');
      clearCart();
    }
  }, [error, clearCart]);

  useEffect(() => {
    if (checkoutState.success) {
      setCheckoutStateToDefault();
      clearCart();
      toast.success('Checkout successful, redirecting to home page');
      router.push(getTenantUrl(slug));
    }
  }, [
    checkoutState.success,
    slug,
    router,
    clearCart,
    setCheckoutStateToDefault
  ]);

  const totalPrice = Object.entries(cartItems).reduce(
    (acc, [productId, quantity]) => {
      const product = products?.docs.find((p) => p.id === productId);
      return acc + (product?.price || 0) * quantity;
    },
    0
  );

  const handleCheckout = () => {
    purchase({
      cartItems,
      tenantSlug: slug
    });
  };

  if (!isHydration || isPending) {
    return <CheckoutViewSkeleton />;
  }

  if (products?.totalDocs === 0) {
    return <EmptyCheckoutView slug={slug} />;
  }

  return (
    <div className='mx-auto w-full max-w-7xl rounded-md p-0 lg:min-h-[calc(100vh-160px)] lg:p-6'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div>
            <p className='font-medium'>{totalItems} items in your cart</p>
          </div>

          <div className='space-y-4'>
            {products?.docs.map((product) => (
              <CartItem
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.images?.[0]?.url}
                quantity={cartItems[product.id]}
                onUpdateQuantity={(quantity) =>
                  updateProductToCart(product.id, quantity)
                }
                onRemove={() => removeProductFromCart(product.id)}
              />
            ))}
          </div>
        </div>
        <div className='space-y-6'>
          <CheckoutSidebar
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
            isPending={isPurchasePending}
            isCancel={checkoutState.cancel}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyCheckoutView({ slug }: { slug: string }) {
  return (
    <div className='border-card bg-card mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center justify-center rounded-md border p-0 lg:p-6'>
      <div className='flex flex-col items-center justify-center gap-y-4'>
        <ShoppingCartIcon />
        <p className='text-base font-medium'>
          Your cart is empty. Continue{' '}
          <Link href={getTenantUrl(slug)} className='underline'>
            shopping
          </Link>
        </p>
      </div>
    </div>
  );
}

function CheckoutViewSkeleton() {
  return (
    <div className='mx-auto w-full max-w-7xl rounded-md p-0 lg:min-h-[calc(100vh-160px)] lg:p-6'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div>
            <Skeleton className='h-4 w-48' />
          </div>

          <div className='space-y-4'>
            {Array.from({ length: 2 }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className='space-y-6'>
          <CheckoutSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}
