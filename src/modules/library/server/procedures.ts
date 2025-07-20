import { z } from 'zod';
import { Media, Tenant } from '@/payload-types';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { DEFAULT_LIMIT } from '@/constants/biz';

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT)
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const orders = await ctx.payloadcms.find({
        collection: 'orders',
        depth: 0, // only get the related product id
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: user.id
          }
        }
      });

      const productIds = orders.docs.map((order) => order.product);

      const products = await ctx.payloadcms.find({
        collection: 'products',
        pagination: false,
        depth: 2,
        where: {
          id: { in: productIds }
        }
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
