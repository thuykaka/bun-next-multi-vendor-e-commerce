import { z } from 'zod';
import { Category } from '@/payload-types';
import type { Where } from 'payload';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

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
        }

        where['category.slug'] = {
          in: categorySlugs
        };
      }

      const products = await ctx.payloadcms.find({
        collection: 'products',
        depth: 1, // Get all fields of related collections e.g, category, images, etc.
        where
      });

      return products;
    })
});
