import { Schema } from "effect";

import {
    EmailSchema,
    HeaderSchema,
    UserIdSchema,
    UserRoleSchema,
} from "@/lib/server/schema";

export class ListUserOptionSchema extends Schema.Class<ListUserOptionSchema>(
    "ListUserOptionSchema"
)({
    options: Schema.Struct({
        searchValue: Schema.optional(
            Schema.Union(Schema.String, Schema.Undefined)
        ),
        searchField: Schema.optional(
            Schema.Union(Schema.Literal("name", "email"), Schema.Undefined)
        ),
        searchOperator: Schema.optional(
            Schema.Union(
                Schema.Literal("contains", "starts_with", "ends_with"),
                Schema.Undefined
            )
        ),
        limit: Schema.optional(
            Schema.Union(Schema.String, Schema.Number, Schema.Undefined)
        ),
        offset: Schema.optional(
            Schema.Union(Schema.String, Schema.Number, Schema.Undefined)
        ),
        sortBy: Schema.optional(Schema.Union(Schema.String, Schema.Undefined)),
        sortDirection: Schema.optional(
            Schema.Union(Schema.Literal("asc", "desc"), Schema.Undefined)
        ),
        filterField: Schema.optional(
            Schema.Union(Schema.String, Schema.Undefined)
        ),
        filterValue: Schema.optional(
            Schema.Union(
                Schema.String,
                Schema.Number,
                Schema.Boolean,
                Schema.Undefined
            )
        ),
        filterOperator: Schema.optional(
            Schema.Union(
                Schema.Literal(
                    "contains",
                    "eq",
                    "ne",
                    "lt",
                    "lte",
                    "gt",
                    "gte"
                ),
                Schema.Undefined
            )
        ),
    }),
    headers: HeaderSchema,
}) {}

export class NewUserSchema extends Schema.Class<NewUserSchema>("NewUserSchema")(
    {
        email: EmailSchema,
        password: Schema.String,
        name: Schema.String,
        role: Schema.optional(Schema.Union(UserRoleSchema, Schema.Undefined)),
        data: Schema.optional(
            Schema.mutable(
                Schema.Record({
                    key: Schema.String,
                    value: Schema.Any,
                })
            )
        ),
    }
) {}

export class SetUserRoleSchema extends Schema.Class<SetUserRoleSchema>(
    "SetUserRoleSchema"
)({
    body: Schema.Struct({
        userId: UserIdSchema,
        role: UserRoleSchema,
    }),
    headers: HeaderSchema,
}) {}

export class SetUserPasswordSchema extends Schema.Class<SetUserPasswordSchema>(
    "SetUserPasswordSchema"
)({
    body: Schema.Struct({
        userId: UserIdSchema,
        newPassword: Schema.String,
    }),
    headers: HeaderSchema,
}) {}

export class UpdateUserSchema extends Schema.Class<UpdateUserSchema>(
    "UpdateUserSchema"
)({
    body: Schema.Struct({
        userId: UserIdSchema,
        data: Schema.mutable(
            Schema.Record({
                key: Schema.String,
                value: Schema.Any,
            })
        ),
    }),
    headers: HeaderSchema,
}) {}

export class BanUserSchema extends Schema.Class<BanUserSchema>("BanUserSchema")(
    {
        body: Schema.Struct({
            userId: UserIdSchema,
            banReason: Schema.optional(Schema.String),
            banExpires: Schema.optional(Schema.Number),
        }),
        headers: HeaderSchema,
    }
) {}

export class UnbanUserSchema extends Schema.Class<UnbanUserSchema>(
    "UnbanUserSchema"
)({
    body: Schema.Struct({
        userId: UserIdSchema,
    }),
    headers: HeaderSchema,
}) {}

export class DeleteUserSchema extends Schema.Class<DeleteUserSchema>(
    "DeleteUserSchema"
)({
    body: Schema.Struct({
        userId: UserIdSchema,
    }),
    headers: HeaderSchema,
}) {}
