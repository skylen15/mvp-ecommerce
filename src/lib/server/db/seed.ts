import { Effect } from "effect";

import { AdminQueries } from "@/features/admin/services/queries";
import { EnvConfig } from "../configs";
import { RuntimeServer } from "../runtime";

Effect.gen(function* () {
	const { checkAdminExists, createAdmin } = yield* AdminQueries;
	const config = yield* EnvConfig;

	const adminExisted = yield* checkAdminExists;

	if (adminExisted.id) {
		yield* Effect.log("Admin user already exists");
		return;
	}

	yield* createAdmin({
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
