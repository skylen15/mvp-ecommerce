import { Config, Effect, Redacted } from "effect";
import { Pool } from "pg";

import { EnvProviderLayer } from "../env";

export const pool = await Effect.gen(function* () {
	return new Pool({
		database: yield* Config.string("DATABASE_NAME"),
		host: yield* Config.string("DATABASE_HOST").pipe(
			Config.withDefault("localhost"),
		),
		user: Redacted.value(yield* Config.redacted("DATABASE_USER")),
		password: Redacted.value(yield* Config.redacted("DATABASE_PASSWORD")),
	});
}).pipe(Effect.provide(EnvProviderLayer), Effect.runPromise);
