import { Schema } from "effect";

import { HeaderSchema } from "@/lib/server/schema";

export const UserIdSchema = Schema.String.pipe(Schema.brand("UserId"));
export const EmailSchema = Schema.String.pipe(
    Schema.pattern(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
);
export const UserRoleSchema = Schema.Union(
    Schema.Literal("user", "admin"),
    Schema.mutable(Schema.Array(Schema.Literal("user", "admin")))
);

export class User extends Schema.Class<User>("User")({
    id: UserIdSchema,
    name: Schema.NonEmptyString,
    email: EmailSchema,
    emailVerified: Schema.Boolean,
    image: Schema.optional(Schema.NullOr(Schema.UndefinedOr(Schema.String))),
    role: UserRoleSchema,
    createdAt: Schema.DateFromSelf,
    updatedAt: Schema.DateFromSelf,
}) {}

export const ListUserOptionSchema = Schema.Struct({
    options: Schema.Struct({
        searchValue: Schema.optional(Schema.UndefinedOr(Schema.String)),
        searchField: Schema.optional(
            Schema.UndefinedOr(Schema.Literal("name", "email"))
        ),
        searchOperator: Schema.optional(
            Schema.UndefinedOr(
                Schema.Literal("contains", "starts_with", "ends_with")
            )
        ),
        limit: Schema.optional(
            Schema.UndefinedOr(Schema.Union(Schema.String, Schema.Number))
        ),
        offset: Schema.optional(
            Schema.UndefinedOr(Schema.Union(Schema.String, Schema.Number))
        ),
        sortBy: Schema.optional(Schema.UndefinedOr(Schema.String)),
        sortDirection: Schema.optional(
            Schema.UndefinedOr(Schema.Literal("asc", "desc"))
        ),
        filterField: Schema.optional(Schema.UndefinedOr(Schema.String)),
        filterValue: Schema.optional(
            Schema.UndefinedOr(
                Schema.Union(Schema.String, Schema.Number, Schema.Boolean)
            )
        ),
        filterOperator: Schema.optional(
            Schema.UndefinedOr(
                Schema.Literal("contains", "eq", "ne", "lt", "lte", "gt", "gte")
            )
        ),
    }),
    headers: HeaderSchema,
});

export class NewUserSchema extends Schema.Class<NewUserSchema>("NewUserSchema")(
    {
        email: EmailSchema,
        password: Schema.String,
        name: Schema.String,
        role: Schema.optional(Schema.UndefinedOr(UserRoleSchema)),
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

export const InserUserSchema = Schema.Struct(User.fields).pipe(
    Schema.omit("id", "createdAt", "updatedAt")
);

export const SetUserRoleSchema = Schema.Struct({
    body: Schema.Struct({
        userId: UserIdSchema,
        role: UserRoleSchema,
    }),
    headers: HeaderSchema,
});

export const SetUserPasswordSchema = Schema.Struct({
    body: Schema.Struct({
        userId: UserIdSchema,
        newPassword: Schema.String,
    }),
    headers: HeaderSchema,
});

export const UpdateUserSchema = Schema.Struct({
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
});

export const BanUserSchema = Schema.Struct({
    body: Schema.Struct({
        userId: UserIdSchema,
        banReason: Schema.optional(Schema.String),
        banExpires: Schema.optional(Schema.Number),
    }),
    headers: HeaderSchema,
});

export const UnbanUserSchema = Schema.Struct({
    body: Schema.Struct({
        userId: UserIdSchema,
    }),
    headers: HeaderSchema,
});

export const DeleteUserSchema = Schema.Struct({
    body: Schema.Struct({
        userId: UserIdSchema,
    }),
    headers: HeaderSchema,
});
