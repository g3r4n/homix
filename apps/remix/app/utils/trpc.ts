import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "@acme/api";

export const trpc = createTRPCReact<AppRouter>();
