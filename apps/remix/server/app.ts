import { authHandler, getAuthUser, initAuthConfig } from "@hono/auth-js";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { getAuthConfig } from "@acme/auth";
import { appRouter, createTRPCContext } from "@acme/trpc";

/* type your Hono variables (used with c.get/c.set) here */
interface Variables extends Record<string, unknown> {
  user?: { id: number; name: string };
}
interface ContextEnv {
  Variables: Variables;
}

const honoRemixApp = new Hono<ContextEnv>();

/**
 * Add logger middleware
 */
honoRemixApp.use("*", logger());

honoRemixApp.use(
  "*",
  initAuthConfig(() => {
    return getAuthConfig();
  }),
);

honoRemixApp.use("/api/auth/*", authHandler());

honoRemixApp.use("/api/trpc/*", async (c, next) => {
  const authUser = await getAuthUser(c);
  return trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (c) =>
      createTRPCContext({
        session: authUser?.session ?? null,
        headers: c.req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  })(c, next);
});

export default honoRemixApp;
