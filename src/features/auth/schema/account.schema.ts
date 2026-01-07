import { Schema } from "effect";

import { UserIdSchema } from "./user.schema";

export const AccountIdSchema = Schema.String.pipe(Schema.brand("AccountId"));
export class Account extends Schema.Class<Account>("Account")({
    id: AccountIdSchema,
    userId: UserIdSchema,
    accountId: UserIdSchema,
    providerId: Schema.Literal("credential"),
    password: Schema.NonEmptyString,
    updatedAt: Schema.DateFromSelf,
}) {}
