import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['700']
});

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href='/'>
      <span
        className={cn(
          'text-4xl font-semibold lg:text-5xl',
          poppinsFont.className,
          className
        )}
      >
        funroad
      </span>
    </Link>
  );
}
