import { Schema } from "effect";

export const CategoryIdSchema = Schema.String.pipe(Schema.brand("CategoryId"));
export class CategorySchema extends Schema.Class<CategorySchema>(
    "CategorySchema"
)({
    id: CategoryIdSchema,
    name: Schema.NonEmptyString,
    parentId: Schema.Union(Schema.Null, CategoryIdSchema),
    image: Schema.Union(Schema.Null, Schema.String),
    slug: Schema.Union(Schema.Null, Schema.String),
    updatedAt: Schema.ValidDateFromSelf,
}) {}
