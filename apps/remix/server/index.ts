import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { AppLoadContext, ServerBuild } from "@remix-run/node";
import { remix } from "remix-hono/handler";

import honoRemixApp from "./app";
import { importDevBuild } from "./dev/server";
import { isProductionMode, mode } from "./utils";

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
 * Start the node server
 */

if (isProductionMode) {
  serve(
    {
      ...honoRemixApp,
      port: Number(process.env.PORT) || 3000,
      hostname: "0.0.0.0",
    },
    async (info) => {
      console.log(`🚀 Server started on port ${info.port}`);
    },
  );
}

export default honoRemixApp;
