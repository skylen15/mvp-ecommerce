import { Effect } from "effect";

import { auth } from "@/lib/server/auth";
import { DbORM } from "@/lib/server/db/orm";
import {
    BanUserSchema,
    DeleteUserSchema,
    ListUserOptionSchema,
    NewUserSchema,
    SetUserPasswordSchema,
    SetUserRoleSchema,
    UnbanUserSchema,
    UpdateUserSchema,
} from "../schema";

export class UserService extends Effect.Service<UserService>()(
    "mvp-ecommerce/features/admin/services/user.service/UserService",
    {
        effect: Effect.gen(function* () {
            const orm = yield* DbORM;

            return {
                listUsers: orm.execute(
                    ListUserOptionSchema,
                    ({ options, headers }) =>
                        Effect.promise(() =>
                            auth.api.listUsers({
                                query: options,
                                headers,
                            })
                        )
                ),
                createUser: orm.execute(NewUserSchema, (body) =>
                    Effect.promise(() =>
                        auth.api.createUser({
                            body,
                        })
                    )
                ),
                setUserRole: orm.execute(
                    SetUserRoleSchema,
                    ({ body, headers }) =>
                        Effect.promise(() =>
                            auth.api.setRole({
                                body,
                                headers,
                            })
                        )
                ),
                setUserPassword: orm.execute(
                    SetUserPasswordSchema,
                    ({ body, headers }) =>
                        Effect.promise(() =>
                            auth.api.setUserPassword({
                                body,
                                headers,
                            })
                        )
                ),
                updateUser: orm.execute(UpdateUserSchema, ({ body, headers }) =>
                    Effect.promise(() =>
                        auth.api.adminUpdateUser({
                            body,
                            headers,
                        })
                    )
                ),
                banUser: orm.execute(BanUserSchema, ({ body, headers }) =>
                    Effect.promise(() =>
                        auth.api.banUser({
                            body,
                            headers,
                        })
                    )
                ),
                unbanUser: orm.execute(UnbanUserSchema, ({ body, headers }) =>
                    Effect.promise(() =>
                        auth.api.unbanUser({
                            body,
                            headers,
                        })
                    )
                ),
                deleteUser: orm.execute(DeleteUserSchema, ({ body, headers }) =>
                    Effect.promise(() =>
                        auth.api.removeUser({
                            body,
                            headers,
                        })
                    )
                ),
            } as const;
        }),
    }
) {}
