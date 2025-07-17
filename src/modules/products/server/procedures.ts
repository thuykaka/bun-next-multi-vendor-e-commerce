import { z } from 'zod';
import { Category } from '@/payload-types';
import type { Where, Sort } from 'payload';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z
          .enum(['curated', 'trending', 'hot_and_new'])
          .nullable()
          .optional()
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
        depth: 1, // Get all fields of related collections e.g, category, images, etc.
        where,
        sort
      });

      return products;
    })
});
