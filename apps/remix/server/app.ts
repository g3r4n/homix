import { authHandler, getAuthUser, initAuthConfig } from "@hono/auth-js";
import { serveStatic } from "@hono/node-server/serve-static";
import { trpcServer } from "@hono/trpc-server";
import { AppLoadContext, ServerBuild } from "@remix-run/node";
import { Hono } from "hono";
import { logger } from "hono/logger";
// You can also use it with other runtimes
import { remix } from "remix-hono/handler";

import { getAuthConfig } from "@acme/auth";
import { appRouter, createTRPCContext } from "@acme/trpc";

import { importDevBuild } from "./dev/server";
import { isProductionMode, mode } from "./utils";

/* type your Hono variables (used with c.get/c.set) here */
interface Variables extends Record<string, unknown> {
  user?: { id: number; name: string };
}
interface ContextEnv {
  Variables: Variables;
}

const honoRemixApp = new Hono<ContextEnv>();
/**
 * Serve assets files from build/client/assets
 */
isProductionMode &&
  honoRemixApp.use("/assets/*", serveStatic({ root: "./build/client" }));

/**
 * Serve public files
 */
isProductionMode &&
  honoRemixApp.use(
    "*",
    serveStatic({ root: isProductionMode ? "./build/client" : "./public" }),
  ); // 1 hour

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

export default honoRemixApp;
