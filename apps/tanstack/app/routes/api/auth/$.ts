import { Auth } from "@auth/core";
import { createAPIFileRoute } from "@tanstack/start/api";

import { getAuthConfig } from "@acme/auth";

export const Route = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => {
    return Auth(request, getAuthConfig());
  },
});
