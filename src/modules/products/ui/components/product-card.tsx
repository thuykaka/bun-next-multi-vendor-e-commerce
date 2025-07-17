import { ShoppingCartIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

type ProductCardProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
  authorName: string;
  authorAvatarUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
};

export function ProductCard({
  id,
  name,
  imageUrl,
  authorName,
  authorAvatarUrl,
  reviewRating,
  reviewCount,
  price
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className='bg-card flex flex-col overflow-hidden rounded-md border'>
        <AspectRatio ratio={4 / 3}>
          <Image
            src={imageUrl || '/product.png'}
            alt={name}
            fill
            className='object-cover transition-all hover:scale-105'
          />
        </AspectRatio>
        <div className='p-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0 flex-1'>
              <h3 className='line-clamp-1 font-medium'>{name}</h3>
              <div className='flex items-center gap-2'>
                <Image
                  src={authorAvatarUrl || '/avatar.jfif'}
                  alt={authorName}
                  width={16}
                  height={16}
                  className='size-[16px] shrink-0 rounded-full border'
                />
                <p className='text-sm underline'>{authorName}</p>
              </div>
            </div>
            {reviewCount > 0 && (
              <div className='shrink-0 text-right'>
                <div className='flex items-center gap-1'>
                  <StarIcon className='h-4 w-4' />
                  <span className='font-medium'>{reviewRating}</span>
                </div>
                <p className='text-muted-foreground text-xs'>
                  {reviewCount} reviews
                </p>
              </div>
            )}
          </div>
          <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 2
                }).format(Number(price))}
              </span>
            </div>
            <Button variant='outline' size='sm'>
              <ShoppingCartIcon className='mr-1 h-4 w-4' />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
