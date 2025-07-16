import { redirect } from 'next/navigation';
import { trpcServerCaller } from '@/trpc/server';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await trpcServerCaller.auth.session();

  if (session?.user) {
    redirect('/');
  }

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>{children}</div>
    </div>
  );
}
