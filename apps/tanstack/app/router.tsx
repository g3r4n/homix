import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import { AppRouter } from "@acme/trpc";

import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>({});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // since we are using Vinxi, the server is running on the same port,
      // this means in dev the url is `http://localhost:3000/trpc`
      // and since its from the same origin, we don't need to explicitly set the full URL
      url: "/api/trpc",
      transformer: SuperJSON,
      async headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "tanstack");
        return headers;
      },
    }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    defaultPreload: "intent",
    context: {
      trpcQueryUtils,
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

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
