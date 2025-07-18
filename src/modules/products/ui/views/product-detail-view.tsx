'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { HeartIcon, Share2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTRPC } from '@/trpc/client';
import { formatPriceCurrency } from '@/lib/format';
import { getTenantUrl } from '@/lib/tenants';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Rating, RatingButton } from '@/components/ui/kibo-ui/rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProductDetailViewProps = {
  productId: string;
  tenantSlug?: string | null;
};

export function ProductDetailView({
  productId,
  tenantSlug
}: ProductDetailViewProps) {
  const trpc = useTRPC();

  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  return (
    <div className='border-card bg-card mx-auto w-full max-w-7xl rounded-md border p-6 lg:min-h-[calc(100vh-200px)]'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
        <div className='space-y-4 lg:col-span-7'>
          <AspectRatio
            ratio={4 / 3}
            className='bg-muted overflow-hidden rounded-xl border'
          >
            <Image
              src={product.images?.[0]?.url || '/product.png'}
              alt={product.name}
              fill
              sizes='100vw'
              className='h-full w-full object-cover'
            />
          </AspectRatio>
        </div>
        <div className='lg:col-span-5'>
          <div className='sticky top-8'>
            <div className='mb-6 flex items-center justify-between'>
              <Link
                href={`${getTenantUrl(product.tenant.slug)}`}
                className='flex items-center justify-center gap-2'
              >
                <Image
                  src={product.tenant.logo?.url || '/avatar.jfif'}
                  alt={product.tenant.name}
                  width={20}
                  height={20}
                  className='size-[20px] shrink-0 rounded-full border'
                />
                <span className='font-medium underline'>
                  {product.tenant.name}
                </span>
              </Link>
              <div className='flex gap-2'>
                <Button variant='ghost' size='icon'>
                  <Share2Icon className='size-4' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <HeartIcon className='size-4' />
                </Button>
              </div>
            </div>
            <h1 className='mb-4 text-4xl font-bold'>{product.name}</h1>

            <div className='mb-6 flex items-center gap-2'>
              <Rating defaultValue={3}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton key={index} size={16} />
                ))}
              </Rating>
              <span className='text-sm font-medium'>4.9</span>
              <span className='text-muted-foreground text-sm'>(128)</span>
            </div>

            <div className='mb-8'>
              <div className='mb-2 text-3xl font-bold'>
                {formatPriceCurrency(product.price)}
              </div>
            </div>

            <Tabs
              defaultValue='description'
              className='mb-8 flex flex-col gap-2'
            >
              <TabsList className='grid w-full grid-cols-3 items-center justify-center rounded-lg'>
                <TabsTrigger value='description'>Description</TabsTrigger>
                <TabsTrigger value='shipping'>Shipping</TabsTrigger>
                <TabsTrigger value='refund'>Refund Policy</TabsTrigger>
              </TabsList>
              <TabsContent value='description' className='mt-4'>
                {product.description}
              </TabsContent>
              <TabsContent value='refund' className='mt-4'>
                {product.refundPolicy === 'no-refund'
                  ? 'No refund'
                  : `We stand behind our products with a comprehensive ${product.refundPolicy} return policy. If you're not completely satisfied, simply return the item in its original condition.`}
              </TabsContent>
              <TabsContent value='shipping' className='mt-4'>
                {product.shippingPolicy}
              </TabsContent>
            </Tabs>

            <div className='mt-8 flex gap-4'>
              <Button className='w-full flex-1' variant='default'>
                Add to Cart
              </Button>
              <Button className='w-full flex-1' variant='outline'>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
