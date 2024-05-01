import { serve } from "@hono/node-server";

import honoRemixApp from "./app";
import { isProductionMode } from "./utils";

/**
 * Start the production server
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
