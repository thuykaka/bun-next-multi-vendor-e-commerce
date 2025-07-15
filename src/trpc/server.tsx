import 'server-only';
import { cache } from 'react';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpcServer = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient
});

// ...
export const trpcServerCaller = appRouter.createCaller(createTRPCContext);

export function HydrateClient(props: {
  children: React.ReactNode;
  suspenseFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.suspenseFallback ? (
        <Suspense fallback={props.suspenseFallback}>
          {props.errorFallback ? (
            <ErrorBoundary fallback={props.errorFallback}>
              {props.children}
            </ErrorBoundary>
          ) : (
            props.children
          )}
        </Suspense>
      ) : (
        props.children
      )}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
