'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Category } from '@/payload-types';
import { ListFilterIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
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
import { Skeleton } from '@/components/ui/skeleton';
import BreadcrumbCategory from './breadcrumb-category';
import CategoriesSidebar from './categories-sidebar';

export default function Categories() {
  const trpc = useTRPC();
  const router = useRouter();
  const params = useParams();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const activeCategorySlug = params.category || 'all';

  const activeCategory = data.docs.find(
    (category) => category.slug === activeCategorySlug
  );

  const activeSubCategoryName = useMemo(() => {
    if (!activeCategory?.subCategories?.docs || !params.subCategory) {
      return undefined;
    }

    const subCategories = activeCategory.subCategories.docs as Category[];
    return subCategories.find(
      (subCategory) => subCategory.slug === params.subCategory
    )?.name;
  }, [activeCategory, params.subCategory]);

  const isMobile = useIsMobile();
  const maxVisibleCategories = useVisibleCategories();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const visibleCategories = data.docs.slice(0, maxVisibleCategories);
  const hasMoreCategories = data.docs.length > maxVisibleCategories;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='w-full'>
        <Skeleton className='bg-accent/50 h-9 w-full' />
      </div>
    );
  }

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    category: Category
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/${category.slug}`);
  };

  return (
    <div className='flex w-full flex-col gap-y-4'>
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
              const isActive = category.slug === activeCategorySlug;
              const hasSubCategories =
                category.subCategories?.docs &&
                category.subCategories.docs.length > 0;

              return (
                <NavigationMenuItem key={category.id}>
                  {hasSubCategories ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          'font-normal',
                          'data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground'
                        )}
                        data-active={isActive}
                        onClick={(e) => handleCategoryClick(e, category)}
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
                      <Link href={`/${category.slug}`}>{category.name}</Link>
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

      <BreadcrumbCategory
        category={activeCategory}
        subCategoryName={activeSubCategoryName}
      />

      <CategoriesSidebar
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </div>
  );
}
