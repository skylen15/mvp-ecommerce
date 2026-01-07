import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("category")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("name", "text", (col) => col.notNull())
        .addColumn("parent_id", "uuid", (col) =>
            col.references("category.id").onDelete("set null")
        )
        .addColumn("image", "varchar(255)", (col) => col.defaultTo(null))
        .addColumn("slug", "varchar(255)", (col) => col.defaultTo(null))
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute();

    await db.schema
        .createTable("product")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("category_id", "uuid", (col) =>
            col.references("category.id").defaultTo(null).onDelete("set null")
        )
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.defaultTo(null))
        .addColumn("price", "decimal(10, 2)", (col) => col.notNull())
        .addColumn("stock", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("active", "boolean", (col) => col.defaultTo(true))
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute();

    await db.schema
        .createTable("product_image")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("product_id", "uuid", (col) =>
            col.references("product.id").notNull().onDelete("cascade")
        )
        .addColumn("image", "varchar(255)", (col) => col.defaultTo(null))
        .addColumn("is_main", "boolean", (col) => col.defaultTo(false))
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute();

    await db.schema
        .createTable("product_variant")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("product_id", "uuid", (col) =>
            col.references("product.id").notNull().onDelete("cascade")
        )
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("price", "decimal(12, 2)", (col) => col.notNull())
        .addColumn("stock", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("sku", "varchar(255)", (col) => col.defaultTo(null))
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("category").execute();
    await db.schema.dropTable("product").execute();
    await db.schema.dropTable("product_image").execute();
    await db.schema.dropTable("product_variant").execute();
}
