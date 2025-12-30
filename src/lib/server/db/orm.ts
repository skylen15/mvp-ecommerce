import * as PgKysely from "@effect/sql-kysely/Pg";
import { PgClient } from "@effect/sql-pg";
import { Data, Effect, flow, Layer, Redacted, Schema } from "effect";
import { Pool } from "pg";

import { EnvConfig } from "../configs";
import type { DB } from "./types";

export class DbError extends Data.TaggedError("DBError")<{
	cause: unknown;
}> {}

export const pool = await Effect.gen(function* () {
	const config = yield* EnvConfig;
	yield* Effect.log("Creating database pool");
	return new Pool({
		connectionString: config.databaseUrl,
	});
}).pipe(Effect.provide(EnvConfig.Default), Effect.runPromise);

const PgClientLive = Layer.unwrapEffect(
	Effect.gen(function* () {
		const config = yield* EnvConfig;
		return PgClient.layer({
			url: Redacted.make(config.databaseUrl),
		});
	}).pipe(Effect.provide(EnvConfig.Default)),
);

export class DbORM extends Effect.Service<DbORM>()(
	"mvp-ecommerce/lib/server/db/effect-orm/DbORM",
	{
		effect: Effect.gen(function* () {
			const db = yield* PgKysely.make<DB>();

			const execute = <A, I, T, E>(
				schema: Schema.Schema<A, I>,
				exec: (values: I) => Effect.Effect<T, E>,
			) =>
				flow(
					Schema.decode(schema),
					Effect.flatMap(Schema.encode(schema)),
					Effect.tap((encoded) => Effect.log("Insert", encoded)),
					Effect.mapError(
						(error) => new DbError({ cause: error.message }),
					),
					Effect.flatMap(exec),
					Effect.tap((_) => Effect.log("Inserted", _)),
				);

			const query = <R>(
				execute: (_: typeof db) => Promise<R>,
				message: string = "",
			) =>
				Effect.tryPromise({
					try: () => execute(db),
					catch: (error) => new DbError({ cause: message || error }),
				});

			return {
				execute,
				query,
			} as const;
		}),
		dependencies: [PgClientLive],
	},
) {}
