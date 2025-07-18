import { z } from 'zod';
import { Media, Tenant } from '@/payload-types';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string().min(1, 'Slug is required')
      })
    )
    .query(async ({ ctx, input }) => {
      const tenant = await ctx.payloadcms.find({
        collection: 'tenants',
        where: {
          slug: {
            equals: input.slug
          }
        },
        limit: 1,
        pagination: false
      });

      if (!tenant.docs.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tenant not found'
        });
      }

      return tenant.docs[0] as Tenant & {
        logo: Media | null;
      };
    })
});
