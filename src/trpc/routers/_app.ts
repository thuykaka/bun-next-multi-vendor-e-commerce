import { createTRPCRouter } from '@/trpc/init';
import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
