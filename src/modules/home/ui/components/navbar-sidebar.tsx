import { useQuery } from '@tanstack/react-query';
import { NavbarItem } from '@/types/navbar';
import { LayoutDashboardIcon, LogInIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { useTRPC } from '@/trpc/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import Logo from './logo';

type NavbarSidebarProps = {
  items: NavbarItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NavbarSidebar({
  items,
  isOpen,
  onOpenChange
}: NavbarSidebarProps) {
  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side='left' className='p-0 transition-none'>
        <SheetHeader className='border-b p-4'>
          <div className='flex items-center'>
            <SheetTitle>
              <Logo className='text-2xl!' />
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className='flex h-full flex-col overflow-y-auto pb-2'>
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className='hover:bg-accent hover:text-accent-foreground flex w-full items-center p-4 text-left text-base font-medium'
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className='border-t'>
            {!!session?.user ? (
              <Link
                href='/admin'
                className='hover:bg-accent hover:text-accent-foreground flex w-full items-center p-4 text-left text-base font-medium'
                onClick={() => onOpenChange(false)}
              >
                <LayoutDashboardIcon className='size-4' />
                <span className='ml-2'>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href='/sign-in'
                  className='hover:bg-accent hover:text-accent-foreground flex w-full items-center p-4 text-left text-base font-medium'
                  onClick={() => onOpenChange(false)}
                >
                  <LogInIcon className='size-4' />
                  <span className='ml-2'>Login</span>
                </Link>
                <Link
                  href='/sign-up'
                  className='hover:bg-accent hover:text-accent-foreground flex w-full items-center p-4 text-left text-base font-medium'
                  onClick={() => onOpenChange(false)}
                >
                  <ShoppingBagIcon className='size-4' />
                  <span className='ml-2'>Start Selling</span>
                </Link>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
