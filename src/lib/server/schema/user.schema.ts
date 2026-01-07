import { Schema } from "effect";

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
