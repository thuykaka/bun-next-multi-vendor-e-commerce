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
  })
});
