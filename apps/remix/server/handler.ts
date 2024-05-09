import type { AppLoadContext, ServerBuild } from "@remix-run/node";
import { remix } from "remix-hono/handler";

import honoRemixApp from "./app";

/**
 * Add remix middleware to Hono server
 */
honoRemixApp.use(async (c, next) => {
  const build = (await import(
    "../build/server/remix.js"
  )) as unknown as ServerBuild;

  return remix({
    build,
    mode: "production",
    getLoadContext() {
      return {
        appVersion: build.assets.version,
      } satisfies AppLoadContext;
    },
  })(c, next);
});

export default honoRemixApp;
