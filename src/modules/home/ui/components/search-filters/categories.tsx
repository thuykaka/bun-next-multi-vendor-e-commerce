import { Category } from '@/payload-types';
import Link from 'next/link';
import { PaginatedDocs } from 'payload';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

type CategoriesProps = {
  data: PaginatedDocs<Category>;
};

export default function Categories({ data }: CategoriesProps) {
  return (
    <div className='w-full'>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className='gap-2'>
          {data.docs.map((category) => (
            <NavigationMenuItem key={category.id}>
              {(category.subCategories?.docs?.length || 0) > 0 ? (
                <>
                  <NavigationMenuTrigger className='font-normal'>
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid w-[300px] gap-4'>
                      {(category.subCategories?.docs as Category[])?.map(
                        (subCategory) => (
                          <li key={subCategory.id}>
                            <NavigationMenuLink asChild>
                              <Link href={subCategory.slug}>
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
                <NavigationMenuLink asChild>
                  <Link href={category.slug}>{category.name}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
