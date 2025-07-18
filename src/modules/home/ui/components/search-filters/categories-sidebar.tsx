import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Category } from '@/payload-types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

export default function CategoriesSidebar({
  isOpen,
  onOpenChange
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const [parentCategories, setParentCategories] = useState<Category[] | null>(
    null
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const currentCategories = parentCategories ?? data.docs ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: Category) => {
    if (
      category.subCategories?.docs &&
      category.subCategories.docs.length > 0
    ) {
      setParentCategories(category.subCategories.docs as Category[]);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === 'all') {
          router.push('/');
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBack = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side='left' className='p-0 transition-none'>
        <SheetHeader className='border-b'>
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className='flex h-full flex-col overflow-y-auto pb-2'>
          {parentCategories && (
            <button
              onClick={handleBack}
              className='hover:bg-accent hover:text-accent-foreground flex w-full items-center p-4 text-left text-base font-medium'
            >
              <ChevronLeftIcon className='mr-2 h-4 w-4' />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className='hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between p-4 text-base font-medium'
            >
              {category.name}
              {!!category.subCategories?.docs &&
                category.subCategories.docs.length > 0 && (
                  <ChevronRightIcon className='ml-auto h-4 w-4' />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
