import { Schema } from "effect";

export const HeaderSchema = Schema.Record({
    key: Schema.String,
    value: Schema.Any,
});
