import { Effect } from "effect";

import { DbORM } from "@/lib/server/db/orm";
import { CategorySchema } from "../schema";

export class CategoryService extends Effect.Service<CategoryService>()(
    "mvp-ecommerce/features/category/services/category.service/CategoryService",
    {
        effect: Effect.gen(function* () {
            const orm = yield* DbORM;
            return {
                update: orm.execute(CategorySchema, (values) =>
                    orm.query((_) =>
                        _.updateTable("category")
                            .set(values)
                            .where("id", "=", values.id)
                            .executeTakeFirst()
                    )
                ),
                create: orm.execute(CategorySchema, (values) =>
                    orm.query((_) =>
                        _.insertInto("category")
                            .values(values)
                            .returning(["id"])
                            .executeTakeFirst()
                    )
                ),
                findAll: () =>
                    orm.query((_) =>
                        _.selectFrom("category").selectAll().execute()
                    ),
                findOne: (name: string) =>
                    orm.query((_) =>
                        _.selectFrom("category")
                            .where("name", "=", name)
                            .selectAll()
                            .executeTakeFirst()
                    ),
                findByParent: (parentId: string) =>
                    orm.query((_) =>
                        _.selectFrom("category")
                            .where("parent_id", "=", parentId)
                            .selectAll()
                            .execute()
                    ),
                delete: (id: string) =>
                    orm.query((_) =>
                        _.deleteFrom("category").where("id", "=", id).execute()
                    ),
            } as const;
        }),
        dependencies: [DbORM.Default],
    }
) {}
