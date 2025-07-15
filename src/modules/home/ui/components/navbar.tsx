'use client';

import { useState } from 'react';
import { NavbarItem } from '@/types/navbar';
import { LogInIcon, MenuIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
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

  return (
    <nav
      className={cn(
        'border-border bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 transition-all duration-200'
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

        <div className='hidden gap-x-4 lg:flex'>
          <Button variant='outline' asChild>
            <Link href='/sign-in'>
              <LogInIcon className='size-4' />
              Login
            </Link>
          </Button>
          <Button variant='default' asChild>
            <Link href='/sign-up'>
              <ShoppingBagIcon className='size-4' />
              Start Selling
            </Link>
          </Button>
        </div>

        <div className='flex items-center justify-center lg:hidden'>
          <Button
            variant='ghost'
            className='size-15 border-transparent bg-white'
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
