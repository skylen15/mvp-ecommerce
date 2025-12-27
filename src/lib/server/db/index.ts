import { Kysely, PostgresDialect } from "kysely";
import { Config, Effect, Redacted } from "effect";
import { Pool } from "pg";

import type { DB } from "./db";
import { RuntimeServer } from "../runtime";

export const pool = await Effect.gen(function* () {
	return new Pool({
		database: yield* Config.string("DATABASE_NAME"),
		host: yield* Config.string("DATABASE_HOST").pipe(
			Config.withDefault("localhost"),
		),
		user: Redacted.value(yield* Config.redacted("DATABASE_USER")),
		password: Redacted.value(yield* Config.redacted("DATABASE_PASSWORD")),
	});
}).pipe(RuntimeServer.runPromise);

const dialect = new PostgresDialect({
	pool,
});

export const db = new Kysely<DB>({
	dialect,
});
