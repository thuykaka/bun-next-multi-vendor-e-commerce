'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { ReviewForm } from '@/modules/library/ui/components/review-form';

type ReviewSidebarProps = {
  productId: string;
};

export default function ReviewSidebar({ productId }: ReviewSidebarProps) {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );

  return (
    <div className='bg-sidebar rounded-md border'>
      <div className='flex items-center justify-between border-b p-4'>
        <h2 className='font-medium'>Review</h2>
      </div>
      <div className='flex flex-col gap-2 border-b p-4'>
        <ReviewForm productId={productId} initialData={review} />
      </div>
    </div>
  );
}
