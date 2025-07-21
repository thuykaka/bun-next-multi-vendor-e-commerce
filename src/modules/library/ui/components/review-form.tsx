'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Review } from '@/payload-types';
import { Loader2Icon, PencilIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Rating, RatingButton } from '@/components/ui/kibo-ui/rating';
import { Textarea } from '@/components/ui/textarea';

type ReviewFormProps = {
  productId: string;
  initialData: Review | null;
};

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  rating: z
    .number()
    .min(1, 'Rating is required')
    .max(5, 'Rating must be at most 5')
});

export function ReviewForm({ productId, initialData }: ReviewFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isPreview, setIsPreview] = useState(!!initialData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
      rating: initialData?.rating || 0
    }
  });

  const onSuccess = () => {
    queryClient.invalidateQueries(
      trpc.reviews.getOne.queryOptions({ productId })
    );
    toast.success('Review submitted successfully');
    setIsPreview(true);
  };

  const { mutate: createReview, isPending: isPendingCreate } = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess,
      onError: (error) => toast.error(error.message)
    })
  );

  const { mutate: updateReview, isPending: isPendingUpdate } = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess,
      onError: (error) => toast.error(error.message)
    })
  );

  const handleUpdateReview = (data: z.infer<typeof formSchema>) => {
    if (!initialData) return;
    updateReview({
      id: initialData.id,
      ...data
    });
  };

  const handleCreateReview = (data: z.infer<typeof formSchema>) => {
    createReview({ productId, ...data });
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!!initialData) {
      handleUpdateReview(data);
    } else {
      handleCreateReview(data);
    }
  };

  const isPending = isPendingCreate || isPendingUpdate;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-y-4'
      >
        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center gap-x-2'>
              <FormControl>
                <Rating
                  value={field.value}
                  onValueChange={field.onChange}
                  readOnly={isPending || isPreview}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton key={index} className='text-yellow-500' />
                  ))}
                </Rating>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='border-border placeholder:text-muted-foreground/50 h-24'
                  placeholder='Write your review here...'
                  required
                  disabled={isPending || isPreview}
                />
              </FormControl>
              <FormDescription className='text-xs text-balance'>
                Please write a review for this product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending && <Loader2Icon className='animate-spin' />}
            {!!initialData ? 'Update Review' : 'Submit Review'}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          variant='outline'
          className='w-full'
          onClick={() => setIsPreview(false)}
        >
          Edit Review
        </Button>
      )}
    </Form>
  );
}
