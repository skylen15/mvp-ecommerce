import { Config, Effect, Redacted } from "effect";

import { DbORM } from "./orm";
import { RuntimeServer } from "../runtime";

Effect.gen(function* () {
	const orm = yield* DbORM;
	const adminExisted = yield* orm.checkAdminExists;

	if (adminExisted.id) {
		yield* Effect.log("Admin user already exists");
		return;
	}

	yield* orm.createAdminUser({
		email: Redacted.value(yield* Config.redacted("ADMIN_EMAIL")),
		password: Redacted.value(yield* Config.redacted("ADMIN_PASSWORD")),
		name: yield* Config.string("ADMIN_NAME"),
		role: "admin",
	});

	yield* Effect.log("Admin user created successfully");
}).pipe(
	Effect.catchTags({
		DBError: (error) => Effect.logError("[DB Error]", error.cause),
		ConfigError: (error) =>
			Effect.logError("[Config Error]", error.message),
	}),
	RuntimeServer.runPromise,
);
