import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { setCookie } from '@/lib/cookies';
import { getCurrentUser } from '@/lib/payloadcms';
import { stripe } from '@/lib/stripe';

export const authRouter = createTRPCRouter({
  me: baseProcedure.query(async () => {
    const currentUser = await getCurrentUser();
    return currentUser;
  }),
  register: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(8),
        username: z
          .string()
          .min(4, 'Username must be at least 4 characters long')
          .max(60, 'Username must be less than 60 characters long')
          .regex(
            /^[a-zA-Z0-9]+$/,
            'Username must contain only letters and numbers'
          )
          .transform((val) => val.toLowerCase())
          .refine(
            (val) => !val.includes(' '),
            'Username must not contain spaces'
          )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.payloadcms.find({
        collection: 'users',
        where: {
          or: [
            {
              email: { equals: input.email }
            },
            {
              username: { equals: input.username }
            }
          ]
        },
        limit: 1
      });

      if (existingUser.docs?.[0]) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username or email already exists'
        });
      }

      const stripeAccount = await stripe.accounts.create({});

      if (!stripeAccount) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create Stripe account'
        });
      }

      const tenant = await ctx.payloadcms.create({
        collection: 'tenants',
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: stripeAccount.id
        }
      });

      await ctx.payloadcms.create({
        collection: 'users',
        data: {
          ...input,
          tenants: [
            {
              tenant: tenant.id
            }
          ]
        }
      });

      const data = await ctx.payloadcms.login({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password
        }
      });

      if (!data.token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials'
        });
      }

      await setCookie(
        `${ctx.payloadcms.config.cookiePrefix}-token`,
        data.token
      );

      return data;
    }),
  login: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(8)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.payloadcms.login({
        collection: 'users',
        data: input
      });

      if (!data.token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials'
        });
      }

      await setCookie(
        `${ctx.payloadcms.config.cookiePrefix}-token`,
        data.token
      );

      return data;
    })
});
