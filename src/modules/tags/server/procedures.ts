import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { DEFAULT_LIMIT } from '@/constants/biz';

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT)
      })
    )
    .query(async ({ ctx, input }) => {
      const tags = await ctx.payloadcms.find({
        collection: 'tags',
        page: input.cursor,
        limit: input.limit
      });

      return tags;
    })
});
