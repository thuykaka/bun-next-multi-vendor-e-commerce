import z from 'zod';
import { Media, Tenant } from '@/payload-types';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.payloadcms.find({
        collection: 'products',
        where: { id: { in: input.productIds } }
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some products were not found'
        });
      }

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
