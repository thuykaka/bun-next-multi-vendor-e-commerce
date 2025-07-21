'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';

export function StripeVerifyView() {
  const router = useRouter();
  const trpc = useTRPC();

  const { mutate: verifyStripeAccount } = useMutation(
    trpc.checkout.veryfy.mutationOptions({
      onSuccess: (data) => {
        router.push(data.url);
      },
      onError: (error) => {
        toast.error(error.message);
        router.push('/');
      }
    })
  );

  useEffect(() => {
    verifyStripeAccount();
  }, [verifyStripeAccount]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <Loader2Icon className='h-10 w-10 animate-spin' />
      <p className='text-muted-foreground'>
        Please wait while we verify your account...
      </p>
    </div>
  );
}
