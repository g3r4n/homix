import type { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

import styles from "./tailwind.css?url";

export default function App() {
  return (
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

        <Scripts />
      </body>
    </html>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
