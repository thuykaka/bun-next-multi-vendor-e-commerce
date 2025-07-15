'use client';

import { useState } from 'react';
import { Category } from '@/payload-types';
import { ListFilterIcon } from 'lucide-react';
import Link from 'next/link';
import { PaginatedDocs } from 'payload';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVisibleCategories } from '@/modules/home/ui/hooks/use-visible-categories';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import CategoriesSidebar from './categories-sidebar';

type CategoriesProps = {
  data: PaginatedDocs<Category>;
};

export default function Categories({ data }: CategoriesProps) {
  // Di chuyển tất cả hooks lên đầu component
  const activeCategory = 'all';
  const isMobile = useIsMobile();
  const maxVisibleCategories = useVisibleCategories();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const visibleCategories = data.docs.slice(0, maxVisibleCategories);
  const hasMoreCategories = data.docs.length > maxVisibleCategories;

  return (
    <div className='w-full'>
      {isMobile ? (
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start'
          onClick={() => setIsSidebarOpen(true)}
        >
          <ListFilterIcon className='mr-2 h-4 w-4' />
          View All Categories ({data.docs.length})
        </Button>
      ) : (
        <NavigationMenu viewport={false}>
          <NavigationMenuList className='gap-2'>
            {visibleCategories.map((category) => {
              const isActive = category.slug === activeCategory;

              return (
                <NavigationMenuItem key={category.id}>
                  {(category.subCategories?.docs?.length || 0) > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          'font-normal',
                          'data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground'
                        )}
                        data-active={isActive}
                      >
                        {category.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid w-full min-w-[200px] gap-4 truncate'>
                          {(category.subCategories?.docs as Category[])?.map(
                            (subCategory) => (
                              <li key={subCategory.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/${category.slug}/${subCategory.slug}`}
                                  >
                                    {subCategory.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            )
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild data-active={isActive}>
                      <Link href={category.slug}>{category.name}</Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              );
            })}
            {hasMoreCategories && (
              <NavigationMenuItem>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <ListFilterIcon className='h-4 w-4' />
                  View All ({data.docs.length})
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      )}

      <CategoriesSidebar
        data={data}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </div>
  );
}
