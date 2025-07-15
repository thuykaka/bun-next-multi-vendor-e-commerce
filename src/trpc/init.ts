import { cache } from 'react';
import config from '@payload-config';
import { initTRPC, TRPCError } from '@trpc/server';
import { getPayload } from 'payload';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const payload = await getPayload({ config });
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

// Base router and procedure helpers
export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;
