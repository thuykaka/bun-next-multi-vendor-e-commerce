import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPriceCurrency } from '@/lib/format';
import { getTenantUrl } from '@/lib/tenants';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type ProductCardProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
  authorName: string;
  authorSlug: string;
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
  authorSlug,
  authorAvatarUrl,
  reviewRating,
  reviewCount,
  price
}: ProductCardProps) {
  const router = useRouter();

  const handleOpenTenantPage = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(getTenantUrl(authorSlug));
  };

  return (
    <Link href={`${getTenantUrl(authorSlug)}/products/${id}`}>
      <div className='bg-card flex flex-col overflow-hidden rounded-md border'>
        <AspectRatio ratio={4 / 3}>
          <Image
            src={imageUrl || '/product.png'}
            alt={name}
            fill
            sizes='33vw'
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
                <p className='text-sm underline' onClick={handleOpenTenantPage}>
                  {authorName}
                </p>
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
              <span className='font-medium'>{formatPriceCurrency(price)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
