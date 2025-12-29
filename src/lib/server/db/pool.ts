import { Effect } from "effect";
import { Pool } from "pg";

import { EnvConfig } from "../configs";

export const pool = await Effect.gen(function* () {
	const config = yield* EnvConfig;
	yield* Effect.log("Creating database pool");
	return new Pool({
		connectionString: config.databaseUrl,
	});
}).pipe(Effect.provide(EnvConfig.Default), Effect.runPromise);
