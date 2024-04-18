import type { LinksFunction } from "@remix-run/node";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import { SessionProvider } from "next-auth/react";

import styles from "./tailwind.css?url";

export const loader = async () => {
  const nextAuthUrl = process.env.NEXTAUTH_URL ?? "/";
  if (!nextAuthUrl) throw new Error("NEXTAUTH_URL is not set");
  return json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });
};

export default function App() {
  const { NEXTAUTH_URL } = useLoaderData<typeof loader>();
  return (
    <SessionProvider>
      <html>
        <head>
          <link rel="icon" href="data:image/x-icon;base64,AA" />
          <Meta />
          <Links />
        </head>
        <body>
          <h1 className="text-4xl">Hello world!</h1>
          <span className="text-red-500">Powered by Homix</span>
          <Outlet />

          <script
            // NextAuth session provider reads window.process.env.NEXTAUTH_URL, so
            // is using, then you'll need to set it here, else will fail.
            // credit: https://sergiodxa.com/articles/use-process-env-client-side-with-remix
            dangerouslySetInnerHTML={{
              __html: `window.process = ${JSON.stringify({
                env: {
                  NEXTAUTH_URL,
                },
              })}`,
            }}
          />
          <Scripts />
        </body>
      </html>
    </SessionProvider>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
