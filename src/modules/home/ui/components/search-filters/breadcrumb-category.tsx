import { Category } from '@/payload-types';
import { ListIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

type BreadcrumbCategoryProps = {
  category?: Category;
  subCategoryName?: string;
};

export default function BreadcrumbCategory({
  category,
  subCategoryName
}: BreadcrumbCategoryProps) {
  if (!category || category.slug === 'all') return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {subCategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                href='/'
                asChild
                className='text-base font-medium'
              >
                <Link href={`/${category.slug}`}>{category.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-muted-foreground/70 text-base font-medium'>
                {subCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className='text-base font-medium'>
              {category.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
