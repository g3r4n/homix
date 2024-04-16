import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { connectionStr } from "./config";
import * as auth from "./schema/auth";
import * as post from "./schema/post";

export const schema = { ...auth, ...post };

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/mysql-core";

const queryClient = postgres("postgres://postgres:postgres@0.0.0.0:5432/db");
export const db = drizzle(queryClient, { schema });
