import { Auth, AuthConfig, createActionURL } from "@auth/core";
import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { getAuthConfig, Session } from "@acme/auth";
import { appRouter, createTRPCContext } from "@acme/trpc";

async function getSession(headers: Headers, config: AuthConfig) {
  const url = createActionURL(
    "session",
    headers.get("x-forwarded-proto"),
    headers,
    process.env,
    config.basePath,
  );
  const request = new Request(url, {
    headers: { cookie: headers.get("cookie") ?? "" },
  });

  return Auth(request, {
    ...config,
    callbacks: {
      ...config.callbacks,
      // Since we are server-side, we don't need to filter out the session data
      // See https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
      // TODO: Taint the session data to prevent accidental leakage to the client
      // https://react.dev/reference/react/experimental_taintObjectReference
      async session(...args) {
        const session =
          // If the user defined a custom session callback, use that instead
          (await config.callbacks?.session?.(...args)) ?? {
            ...args[0].session,
            expires:
              args[0].session.expires?.toISOString?.() ??
              args[0].session.expires,
          };
        const user = args[0].user ?? args[0].token;
        return { user, ...session } satisfies Session;
      },
    },
  }) as Promise<Response>;
}

const handler = async ({ request }: { request: Request }) => {
  const sessionResponse = await getSession(request.headers, getAuthConfig());
  const session = await sessionResponse.json();
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
