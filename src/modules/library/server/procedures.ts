import { z } from 'zod';
import { Media, Tenant } from '@/payload-types';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { DEFAULT_LIMIT } from '@/constants/biz';

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1, 'Product ID is required')
      })
    )
    .query(async ({ ctx, input }) => {
      const orders = await ctx.payloadcms.find({
        collection: 'orders',
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: { equals: input.productId }
            },
            {
              user: { equals: ctx.session.user.id }
            }
          ]
        }
      });

      const order = orders.docs[0];

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found'
        });
      }

      const product = await ctx.payloadcms.findByID({
        collection: 'products',
        id: input.productId
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        });
      }

      return product;
    }),
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

      const productsWithReviews = await Promise.all(
        products.docs.map(async (product) => {
          const reviews = await ctx.payloadcms.find({
            collection: 'reviews',
            where: {
              product: {
                equals: product.id
              }
            }
          });

          const reviewCount = reviews.totalDocs;
          const averageRating =
            reviewCount === 0
              ? 0
              : reviews.docs?.reduce((acc, review) => acc + review.rating, 0) /
                reviewCount;

          return {
            ...product,
            reviewCount,
            averageRating
          };
        })
      );

      return {
        ...products,
        docs: productsWithReviews.map((product) => ({
          ...product,
          images: product.images as Media[] | null,
          tenant: product.tenant as Tenant & {
            logo: Media | null;
          }
        }))
      };
    })
});
