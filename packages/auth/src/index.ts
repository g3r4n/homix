import type { AuthConfig, AuthUser } from "@hono/auth-js";
import { Auth, createActionURL } from "@auth/core";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db, tableCreator } from "@acme/db";

export type Session = AuthUser["session"];

export interface AuthEnv {
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
}

export const getAuthConfig = () => {
  return {
    basePath: "/api/auth",
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db, tableCreator),
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      session: (opts) => {
        if (!("user" in opts)) throw "unreachable with session strategy";

        return {
          ...opts.session,
          user: {
            ...opts.session.user,
            id: opts.user.id,
          },
        };
      },
    },
  } satisfies AuthConfig;
};

export async function getSession(req: Request) {
  const config = getAuthConfig();
  const parsedUrl = new URL(req.url);
  const url = createActionURL(
    "session",
    parsedUrl.protocol,
    req.headers,
    process.env,
    config.basePath,
  );
  const request = new Request(url, {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });

  const sessionData = await Auth(request, config);
  return (await sessionData.json()) as Session;
}
