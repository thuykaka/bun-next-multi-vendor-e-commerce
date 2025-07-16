'use client';

import { useQuery } from '@tanstack/react-query';
import { BookmarkCheckIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

type SearchInputProps = {
  disabled?: boolean;
};

export default function SearchInput({ disabled = false }: SearchInputProps) {
  const trpc = useTRPC();
  const { data: session, isPending } = useQuery(
    trpc.auth.session.queryOptions()
  );

  return (
    <div className='flex w-full items-center gap-4 pt-20'>
      <div className='relative w-full'>
        <SearchIcon className='absolute top-1/2 left-2 size-4 -translate-y-1/2' />
        <Input
          disabled={disabled}
          placeholder='Search for a product...'
          className='border-border bg-background pl-8'
        />
      </div>
      {isPending ? (
        <Skeleton className='bg-accent/50 h-9 w-20' />
      ) : !!session?.user ? (
        <Button variant='outline' asChild>
          <Link href='/library'>
            <BookmarkCheckIcon className='mr-2 size-4' />
            Library
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
