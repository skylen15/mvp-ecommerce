import { hashPassword } from "better-auth/crypto";
import { DateTime, Effect } from "effect";

import { Account, User, UserId } from "@/features/auth/schema";
import { DbError, DbORM } from "@/lib/server/db/orm";
import { singleResult } from "@/lib/server/utils/filter";

export class AdminQueries extends Effect.Service<AdminQueries>()(
	"mvp-ecommerce/features/admin/services/queries/AdminQueries",
	{
		effect: Effect.gen(function* () {
			const { execute, query } = yield* DbORM;
			return {
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

						const createdAccount = yield* execute(Account, (acc) =>
							query((_) =>
								_.insertInto("account")
									.values({
										...acc,
										password: accountData.password,
										updatedAt: DateTime.formatIsoDateUtc(
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
			} as const;
		}),
		dependencies: [DbORM.Default],
	},
) {}
