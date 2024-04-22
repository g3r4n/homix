import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "@acme/trpc";

export const trpc = createTRPCReact<AppRouter>();
