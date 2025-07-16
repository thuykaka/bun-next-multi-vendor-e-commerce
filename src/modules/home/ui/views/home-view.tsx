'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export default function HomeView() {
  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className='h-screen w-full'>
      <h1 className='text-4xl font-bold'>Welcome to Funroad</h1>
      <pre>{JSON.stringify(session?.user)}</pre>
    </div>
  );
}
