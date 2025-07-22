import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPriceCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type CartItemProps = {
  id: string;
  tenantSlug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  onRemove: () => void;
};

export function CartItem({
  id,
  tenantSlug,
  name,
  price,
  imageUrl,
  onRemove
}: CartItemProps) {
  return (
    <Card className='overflow-hidden p-0'>
      <CardContent className='p-0'>
        <div className='flex h-full flex-col md:flex-row'>
          <div className='relative h-auto w-full md:w-32'>
            <Image
              src={imageUrl || '/product.png'}
              alt={name}
              width={100}
              height={100}
              className='h-[200px] w-full object-cover md:w-32 lg:h-[120px]'
            />
          </div>
          <div className='flex-1 p-6 pb-3'>
            <div className='flex justify-between'>
              <div>
                <Link
                  href={`/tenants/${tenantSlug}/products/${id}`}
                  className='underline'
                >
                  <h3 className='font-medium'>{name}</h3>
                </Link>
              </div>
              <Button variant='ghost' size='icon' onClick={onRemove}>
                <Trash2Icon className='size-4' />
              </Button>
            </div>

            <div className='mt-4 flex items-center justify-between'>
              <div className='text-right'>
                <div className='font-medium'>{formatPriceCurrency(price)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CartItemSkeleton() {
  return <Skeleton className='h-[250px] w-full object-cover lg:h-[150px]' />;
}
