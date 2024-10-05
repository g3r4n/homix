import {
  dehydrate,
  hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/trpc";

import { routeTree } from "./routeTree.gen";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // since we are using Vinxi, the server is running on the same port,
      // this means in dev the url is `http://localhost:3000/trpc`
      // and since its from the same origin, we don't need to explicitly set the full URL
      url: getBaseUrl() + "/api/trpc",
      transformer: SuperJSON,
      async headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "tanstack");
        return headers;
      },
    }),
  ],
});

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
    },
  });

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export function createRouter() {
  const queryClient = getQueryClient();
  const trpcQueryUtils = createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
  });
  const router = createTanStackRouter({
    defaultPreload: "intent",
    context: { trpcQueryUtils },
    dehydrate: () => {
      return {
        dehydratedQueryClient: dehydrate(queryClient, {
          shouldDehydrateQuery: () => true,
        }),
      };
    },
    hydrate: (data) => {
      hydrate(queryClient, data.dehydratedQueryClient);
    },
    routeTree,
    Wrap: function WrapComponent({ children }) {
      return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      );
    },
  });

  return router;
}

export interface RouterAppContext {
  trpcQueryUtils: ReturnType<typeof createTRPCQueryUtils<AppRouter>>;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
