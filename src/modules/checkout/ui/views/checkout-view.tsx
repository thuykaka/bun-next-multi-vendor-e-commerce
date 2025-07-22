'use client';

import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const { totalItems, cartItems, clearCart, removeProductFromCart } =
    useCart(slug);

  const {
    data: products,
    error,
    isPending
  } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      productIds: cartItems
    })
  );

  const resetCheckoutState = () => {
    setCheckoutState({
      success: false,
      cancel: false
    });
  };

  const { mutate: purchase, isPending: isPurchasePending } = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        resetCheckoutState();
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
      resetCheckoutState();
      clearCart();

      queryClient.invalidateQueries(
        trpc.library.getMany.infiniteQueryOptions({})
      );

      toast.success('Checkout successful, redirecting to home page');
      router.push('/library');
    }
  }, [
    checkoutState.success,
    clearCart,
    resetCheckoutState,
    router,
    queryClient,
    trpc.library.getMany.infiniteQueryOptions
  ]);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((acc, productId) => {
        const product = products?.docs.find((p) => p.id === productId);
        return acc + (product?.price || 0);
      }, 0),
    [cartItems, products]
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
                id={product.id}
                tenantSlug={slug}
                name={product.name}
                price={product.price}
                imageUrl={product.images?.[0]?.url}
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
