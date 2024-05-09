import devServer from "@hono/vite-dev-server";
import { vitePlugin as remix } from "@remix-run/dev";
import esbuild from "esbuild";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    // https://github.com/remix-run/remix/discussions/8917#discussioncomment-8640023
    warmup: {
      clientFiles: [
        "./app/entry.client.tsx",
        "./app/root.tsx",
        "./app/routes/**/*",
      ],
    },
  },
  // https://github.com/remix-run/remix/discussions/8917#discussioncomment-8640023
  optimizeDeps: {
    include: ["./app/routes/**/*"],
  },
  plugins: [
    devServer({
      injectClientScript: false,
      entry: "server/index.ts", // The file path of your server.
      exclude: [/^\/(app)\/.+/, /^\/@.+$/, /^\/node_modules\/.*/],
    }),
    tsconfigPaths(),
    remix({
      serverBuildFile: "remix.js",
      buildEnd: async () => {
        await esbuild
          .build({
            alias: { "@": "./app" },
            // The final file name
            outfile: "build/server/index.js",
            // Our server entry point
            entryPoints: ["server/handler.ts"],
            // Dependencies that should not be bundled
            platform: "node",
            format: "esm",
            bundle: true,
            logLevel: "info",
            sourcemap: false,
          })
          .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
          });
      },
    }),
  ],
});
