'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavbarItem } from '@/types/navbar';
import {
  LayoutDashboardIcon,
  LogInIcon,
  MenuIcon,
  ShoppingBagIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import Logo from './logo';
import NavbarSidebar from './navbar-sidebar';

const navbarItems: NavbarItem[] = [
  {
    children: 'Home',
    href: '/'
  },
  {
    children: 'About',
    href: '/about'
  },
  {
    children: 'Features',
    href: '/features'
  },
  {
    children: 'Pricing',
    href: '/pricing'
  },
  {
    children: 'Contact',
    href: '/contact'
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const isScrolled = useScroll();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav
      className={cn(
        'bg-background fixed top-0 right-0 left-0 z-50 p-4 transition-all duration-200',
        isScrolled && 'border-b',
        'px-4 lg:px-10'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-x-12'>
          <Logo />

          <NavbarSidebar
            items={navbarItems}
            isOpen={isOpenSidebar}
            onOpenChange={setIsOpenSidebar}
          />

          <NavigationMenu viewport={false} className='hidden lg:flex'>
            <NavigationMenuList className='gap-4'>
              {navbarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild data-active={isActive}>
                      <Link href={item.href}>{item.children}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='hidden items-center gap-x-4 lg:flex'>
          {!!session?.user ? (
            <Button variant='default' asChild>
              <Link href='/admin' prefetch>
                <LayoutDashboardIcon className='size-4' />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant='outline' asChild>
                <Link href='/sign-in' prefetch>
                  <LogInIcon className='size-4' />
                  Login
                </Link>
              </Button>
              <Button variant='default' asChild>
                <Link href='/sign-up' prefetch>
                  <ShoppingBagIcon className='size-4' />
                  Start Selling
                </Link>
              </Button>
            </>
          )}
          <div>
            <ThemeToggle />
          </div>
        </div>

        <div className='flex items-center justify-center lg:hidden'>
          <Button
            variant='ghost'
            className='bg-background size-15 border-transparent'
            asChild
            onClick={() => setIsOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>
    </nav>
  );
}
