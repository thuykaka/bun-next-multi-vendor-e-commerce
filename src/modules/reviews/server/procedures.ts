import z from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
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

      const reviews = await ctx.payloadcms.find({
        collection: 'reviews',
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id
              }
            },
            {
              user: {
                equals: ctx.session.user.id
              }
            }
          ]
        }
      });

      return reviews.docs?.[0] || null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        description: z.string().min(1, 'Description is required'),
        rating: z
          .number()
          .min(1, 'Rating must be at least 1')
          .max(5, 'Rating must be at most 5')
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      const existingReview = await ctx.payloadcms.find({
        collection: 'reviews',
        pagination: false,
        limit: 1,
        where: {
          and: [
            { product: { equals: product.id } },
            { user: { equals: ctx.session.user.id } }
          ]
        }
      });

      if (existingReview.totalDocs > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have already reviewed this product'
        });
      }

      const review = await ctx.payloadcms.create({
        collection: 'reviews',
        data: {
          description: input.description,
          rating: input.rating,
          product: product.id,
          user: ctx.session.user.id
        }
      });

      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(1, 'Description is required'),
        rating: z
          .number()
          .min(1, 'Rating must be at least 1')
          .max(5, 'Rating must be at most 5')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payloadcms.findByID({
        depth: 0,
        collection: 'reviews',
        id: input.id
      });

      if (!existingReview) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Review not found'
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to update this review'
        });
      }

      const updatedReview = await ctx.payloadcms.update({
        collection: 'reviews',
        id: input.id,
        data: {
          description: input.description,
          rating: input.rating
        }
      });

      return updatedReview;
    })
});
