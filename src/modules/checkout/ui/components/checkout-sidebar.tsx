import {
  AlertCircleIcon,
  CreditCardIcon,
  Loader2,
  Package2Icon,
  ShieldIcon,
  TruckIcon
} from 'lucide-react';
import { formatPriceCurrency } from '@/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type CheckoutSidebarProps = {
  totalPrice: number;
  onCheckout: () => void;
  isPending: boolean;
  isCancel: boolean;
};

export function CheckoutSidebar({
  totalPrice,
  onCheckout,
  isPending,
  isCancel
}: CheckoutSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          Review your order details and shipping information
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6 px-6'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Subtotal</span>
            <span>{formatPriceCurrency(totalPrice)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className='flex justify-between font-medium'>
            <span>Total</span>
            <span>{formatPriceCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className='space-y-4 border-t pt-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Package2Icon className='size-4' />
            <span>Free returns within 30 days</span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <ShieldIcon className='size-4' />
            <span>Secure payment</span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <TruckIcon className='size-4' />
            <span>Fast delivery</span>
          </div>
        </div>

        <Button
          className='w-full px-4 py-2'
          onClick={onCheckout}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Processing...
            </>
          ) : (
            <>
              <CreditCardIcon className='size-4' />
              Proceed to Checkout
            </>
          )}
        </Button>
        {isCancel && (
          <Alert variant='destructive'>
            <AlertCircleIcon className='size-4' />
            <AlertTitle>Checkout cancelled</AlertTitle>
            <AlertDescription>
              Your checkout was cancelled. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function CheckoutSidebarSkeleton() {
  return <Skeleton className='h-[388px] w-full rounded-xl' />;
}
