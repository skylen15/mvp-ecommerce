import { Schema } from "effect";

import { UserIdSchema } from "@/lib/server/schema";

export class User extends Schema.Class<User>("User")({
    name: Schema.NonEmptyString,
    email: Schema.String.pipe(
        Schema.pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ),
    role: Schema.Literal("admin", "user"),
}) {}

export const AccountId = Schema.String.pipe(Schema.brand("AccountId"));
export class Account extends Schema.Class<Account>("Account")({
    userId: UserIdSchema,
    accountId: UserIdSchema,
    providerId: Schema.Literal("credential"),
    password: Schema.String,
}) {}
