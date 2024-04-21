import type { AuthUser } from "@hono/auth-js";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthConfig } from "@hono/auth-js";

import { db, tableCreator } from "@acme/db";

export type Session = AuthUser["session"];

export type AuthEnv = {
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
};

export const getAuthConfig = () => {
  return {
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
