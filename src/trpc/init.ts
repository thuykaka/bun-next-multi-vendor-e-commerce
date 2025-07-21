import { cache } from 'react';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { getCurrentUser, getPayload } from '@/lib/payloadcms';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const payload = await getPayload();
  return { payloadcms: payload };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson
});

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        user: currentUser
      }
    }
  });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthenticated);
