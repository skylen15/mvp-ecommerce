import { Effect } from "effect";
import { EnvConfig } from "../configs";
import { RuntimeServer } from "../runtime";
import { DbORM } from "./orm";

Effect.gen(function* () {
	const orm = yield* DbORM;
	const config = yield* EnvConfig;

	const adminExisted = yield* orm.user.checkAdminExists;

	if (adminExisted.id) {
		yield* Effect.log("Admin user already exists");
		return;
	}

	yield* orm.user.createAdmin({
		...config.admin,
		role: "admin",
	});

	yield* Effect.log("Admin user created successfully");
}).pipe(
	Effect.catchTags({
		DBError: (error) => Effect.logError("[DB Error]", error.cause),
	}),
	RuntimeServer.runPromise,
);
