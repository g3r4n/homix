import * as build from "@remix-run/dev/server-build";
import { Hono } from "hono";
// You can also use it with other runtimes
import { remix } from "remix-hono/handler";

/* type your Hono variables (used with c.get/c.set) here */
interface Variables extends Record<string, unknown> {
  user?: { id: number; name: string };
}
interface ContextEnv {
  Variables: Variables;
}

const honoRemixApp = new Hono<ContextEnv>();

// Add the Remix middleware to your Hono server
honoRemixApp.use(
  "*",
  remix({
    build,
    mode: process.env.NODE_ENV as "development" | "production",
    // getLoadContext is optional, the default function is the same as here
    getLoadContext(c) {
      return c.env;
    },
  }),
);
export { honoRemixApp };
