import { hashPassword } from "better-auth/crypto";
import { DateTime, Effect, flow } from "effect";

import { Account, User } from "@/features/auth/schema";
import { DbError, DbORM } from "@/lib/server/db/orm";
import { UserIdSchema } from "@/lib/server/schema";
import { singleResult } from "@/lib/server/utils";

export class AdminQueries extends Effect.Service<AdminQueries>()(
    "mvp-ecommerce/features/admin/services/queries/AdminQueries",
    {
        effect: Effect.gen(function* () {
            const { execute, query } = yield* DbORM;
            const createUser = execute(User, (values) =>
                query((_) =>
                    _.insertInto("user")
                        .values({
                            ...values,
                            emailVerified: false,
                        })
                        .returning(["id as userId"])
                        .executeTakeFirstOrThrow()
                )
            );

            const createAccount = flow(
                execute(Account, (acc) =>
                    query((_) =>
                        _.insertInto("account")
                            .values({
                                ...acc,
                                updatedAt: DateTime.formatIsoOffset(
                                    DateTime.unsafeNow()
                                ),
                            })
                            .returning(["id as accountId"])
                            .execute()
                    )
                ),
                singleResult(
                    () =>
                        new DbError({
                            cause: "Failed to create account user",
                        })
                )
            );

            return {
                createUser,
                createAccount,
                createAdmin: (
                    data: typeof User.Type & {
                        password: string;
                    }
                ) =>
                    Effect.gen(function* () {
                        const createdUser = yield* createUser(data);

                        const accountData = {
                            userId: UserIdSchema.make(createdUser.userId),
                            accountId: UserIdSchema.make(createdUser.userId),
                            providerId: "credential",
                            password: yield* Effect.promise(() =>
                                hashPassword(data.password)
                            ),
                        } satisfies typeof Account.Type;

                        const createdAccount = yield* createAccount(
                            accountData
                        );

                        return createdAccount;
                    }),

                checkAdminExists: query((_) =>
                    _.selectFrom("user")
                        .where("role", "=", "admin")
                        .select(["id"])
                        .limit(1)
                        .execute()
                ).pipe(
                    singleResult(
                        () => new DbError({ cause: "No admin user found" })
                    ),
                    Effect.catchTag("DBError", () =>
                        Effect.succeed({ id: null })
                    )
                ),
            } as const;
        }),
        dependencies: [DbORM.Default],
    }
) {}
