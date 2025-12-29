import { hashPassword } from "better-auth/crypto";
import { Data, DateTime, Effect, flow, Schema } from "effect";
import { Kysely, PostgresDialect } from "kysely";

import { Account, User, UserId } from "@/features/auth/schema";
import { singleResult } from "../utils/filter";
import type { DB } from "./db";
import { pool } from "./pool";

class DbError extends Data.TaggedError("DBError")<{
	cause: unknown;
}> {}

export class DbORM extends Effect.Service<DbORM>()(
	"mvp-ecommerce/lib/server/db/index/DbORM",
	{
		effect: Effect.gen(function* () {
			const dialect = new PostgresDialect({
				pool,
			});

			const db = new Kysely<DB>({
				dialect,
			});

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

			const query = <R>(execute: (_: typeof db) => Promise<R>) =>
				Effect.tryPromise({
					try: () => execute(db),
					catch: (error) => new DbError({ cause: error }),
				});

			return {
				query,
				execute,
				user: {
					createAdmin: (
						data: typeof User.Type & {
							password: string;
						},
					) =>
						Effect.gen(function* () {
							const createdUser = yield* execute(User, (values) =>
								query((_) =>
									_.insertInto("user")
										.values({
											...values,
											emailVerified: false,
										})
										.returning(["id as userId"])
										.execute(),
								),
							)(data).pipe(
								singleResult(
									() =>
										new DbError({
											cause: "Failed to create admin user",
										}),
								),
							);

							const accountData = {
								userId: UserId.make(createdUser.userId),
								accountId: UserId.make(createdUser.userId),
								providerId: "credential",
								password: yield* Effect.promise(() =>
									hashPassword(data.password),
								),
							} satisfies typeof Account.Type;

							const createdAccount = yield* execute(
								Account,
								(acc) =>
									query((_) =>
										_.insertInto("account")
											.values({
												...acc,
												password: accountData.password,
												updatedAt:
													DateTime.formatIsoDateUtc(
														DateTime.unsafeNow(),
													),
											})
											.returning(["id as accountId"])
											.execute(),
									),
							)(accountData).pipe(
								singleResult(
									() =>
										new DbError({
											cause: "Failed to create account user",
										}),
								),
							);

							return createdAccount;
						}),

					checkAdminExists: query((_) =>
						_.selectFrom("user")
							.where("role", "=", "admin")
							.select(["id"])
							.limit(1)
							.execute(),
					).pipe(
						singleResult(
							() => new DbError({ cause: "No admin user found" }),
						),
						Effect.catchTag("DBError", () =>
							Effect.succeed({ id: null }),
						),
					),
				},
			} as const;
		}),
	},
) {}
