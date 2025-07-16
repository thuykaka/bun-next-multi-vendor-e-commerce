import z from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const categories = await ctx.payloadcms.find({
      collection: 'categories',
      depth: 1,
      where: {
        parent: {
          exists: false
        }
      },
      sort: 'name',
      pagination: false
    });

    return categories;
  }),
  getOne: baseProcedure
    .input(z.object({ slug: z.string().min(1, 'Slug is required') }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.payloadcms.find({
        collection: 'categories',
        where: {
          slug: { equals: input.slug }
        },
        limit: 1,
        pagination: false
      });

      return category.docs?.[0];
    })
});
