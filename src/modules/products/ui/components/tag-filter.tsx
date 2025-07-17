import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants/biz';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type TagsFilterProps = {
  values: string[];
  onChange: (value: string[]) => void;
};

export function TagsFilter({ values, onChange }: TagsFilterProps) {
  const trpc = useTRPC();

  const {
    data: tags,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    trpc.tags.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    )
  );

  const onClick = (tag: string) => {
    if (values?.includes(tag)) {
      // Remove the tag from the values
      onChange(values.filter((value) => value !== tag));
    } else {
      // Add the tag to the values
      onChange([...values, tag]);
    }
  };

  return (
    <div className='flex flex-col gap-y-2'>
      {isPending ? (
        <div className='flex items-center justify-center p-4'>
          <Loader2Icon className='size-4 animate-spin' />
        </div>
      ) : (
        tags?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className='flex cursor-pointer items-center justify-between'
            >
              <p className='font-medium'>{tag.name}</p>
              <Checkbox
                className='border-primary ring-offset-background shrink-0 rounded-sm border'
                checked={values.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <Button
          variant='outline'
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          size='sm'
        >
          {isFetchingNextPage && (
            <Loader2Icon className='size-4 animate-spin' />
          )}
          Load more...
        </Button>
      )}
    </div>
  );
}
