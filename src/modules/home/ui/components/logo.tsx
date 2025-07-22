import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['700']
});

export default function Logo({
  className,
  logo,
  name = 'funroad',
  link = process.env.NEXT_PUBLIC_APP_URL || '/',
  icon
}: {
  name?: string;
  link?: string;
  logo?: string | null;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link prefetch href={link} className='flex items-center gap-x-2'>
      {logo && (
        <Image
          className='shrink-0 rounded-full border'
          src={logo}
          alt={name}
          width={36}
          height={36}
        />
      )}
      {icon && icon}
      <span
        className={cn(
          'text-4xl font-semibold lg:text-5xl',
          poppinsFont.className,
          className
        )}
      >
        {name}
      </span>
    </Link>
  );
}
