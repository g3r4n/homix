import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { AppLoadContext, ServerBuild } from "@remix-run/node";
import { Hono } from "hono";
import { logger } from "hono/logger";
// You can also use it with other runtimes
import { remix } from "remix-hono/handler";

import { getAuthConfig } from "@acme/auth";
import { appRouter, createTRPCContext } from "@acme/trpc";

import { importDevBuild } from "./dev/server";

/* type your Hono variables (used with c.get/c.set) here */
interface Variables extends Record<string, unknown> {
  user?: { id: number; name: string };
}
interface ContextEnv {
  Variables: Variables;
}

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

const isProductionMode = mode === "production";

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

honoRemixApp.use("/api/trpc/*", verifyAuth());

honoRemixApp.use("/api/trpc/*", async (c, next) => {
  const authUser = c.get("authUser");
  return trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (c) =>
      createTRPCContext({
        session: authUser.session,
        headers: c.req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  })(c, next);
});

/**
 * Add remix middleware to Hono server
 */
honoRemixApp.use(async (c, next) => {
  const build = (isProductionMode
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-unresolved -- this expected until you build the app
      await import("../build/server/remix.js")
    : await importDevBuild()) as unknown as ServerBuild;

  return remix({
    build,
    mode,
    getLoadContext() {
      return {
        appVersion: isProductionMode ? build.assets.version : "dev",
      } satisfies AppLoadContext;
    },
  })(c, next);
});

/**
 * Start the production server
 */

if (isProductionMode) {
  serve(
    {
      ...honoRemixApp,
      port: Number(process.env.PORT) || 3000,
    },
    async (info) => {
      console.log(`🚀 Server started on port ${info.port}`);
    },
  );
}

export default honoRemixApp;
