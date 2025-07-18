import { z } from 'zod';
import { Category, Media, Tenant } from '@/payload-types';
import { TRPCError } from '@trpc/server';
import type { Where, Sort } from 'payload';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { DEFAULT_LIMIT } from '@/constants/biz';

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, 'Product ID is required')
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payloadcms.findByID({
        collection: 'products',
        id: input.id
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        });
      }

      return {
        ...product,
        images: product.images as Media[] | null,
        tenant: product.tenant as Tenant & {
          logo: Media | null;
        }
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z
          .enum(['curated', 'trending', 'hot_and_new'])
          .nullable()
          .optional(),
        tenantSlug: z.string().nullable().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = '-name';

      if (input.sort === 'trending') {
        sort = '+name';
      } else if (input.sort === 'hot_and_new') {
        sort = '+name';
      }

      if (input.minPrice) {
        where['price'] = {
          ...where['price'],
          greater_than_equal: Number(input.minPrice)
        };
      }

      if (input.maxPrice) {
        where['price'] = {
          ...where['price'],
          less_than_equal: Number(input.maxPrice)
        };
      }

      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: input.tags
        };
      }

      if (input.tenantSlug) {
        where['tenant.slug'] = {
          equals: input.tenantSlug
        };
      }

      if (input.category) {
        const categories = await ctx.payloadcms.find({
          collection: 'categories',
          where: {
            slug: { equals: input.category }
          },
          limit: 1,
          pagination: false
        });

        const category = categories.docs?.[0];

        // add to where clause
        const categorySlugs = [input.category];

        if (category) {
          const subCategories = category.subCategories?.docs?.filter(
            (doc): doc is Category => typeof doc === 'object' && doc !== null
          ) as Category[] | undefined;

          // check this category has sub categories, if it does, add all sub category slugs to the where clause
          if (subCategories) {
            categorySlugs.push(
              ...subCategories.map((subCategory) => subCategory.slug)
            );
          }

          where['category.slug'] = {
            in: categorySlugs
          };
        }
      }

      const products = await ctx.payloadcms.find({
        collection: 'products',
        depth: 2, // Get all fields of related collections e.g, category, images, etc.
        where,
        sort,
        page: input.cursor,
        limit: input.limit
      });

      return {
        ...products,
        docs: products.docs.map((product) => ({
          ...product,
          images: product.images as Media[] | null,
          tenant: product.tenant as Tenant & {
            logo: Media | null;
          }
        }))
      };
    })
});
