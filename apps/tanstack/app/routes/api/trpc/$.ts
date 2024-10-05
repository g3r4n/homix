import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { getSession } from "@acme/auth";
import { appRouter, createTRPCContext } from "@acme/trpc";

const handler = async ({ request }: { request: Request }) => {
  const session = await getSession(request.clone());
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: request,
    createContext: () =>
      createTRPCContext({
        session,
        headers: request.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  return response;
};

export const Route = createAPIFileRoute("/api/trpc/$")({
  GET: handler,
  POST: handler,
});
