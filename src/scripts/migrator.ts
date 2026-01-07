import { NodeContext } from "@effect/platform-node";
import { PgMigrator } from "@effect/sql-pg";
import { Layer } from "effect";
import { fileURLToPath } from "node:url";

import { DatabaseLive } from "@/lib/server/db/database";

export const MigratorLive = PgMigrator.layer({
    schemaDirectory: "src/migrations",
    loader: PgMigrator.fromFileSystem(
        fileURLToPath(new URL("../migrations", import.meta.url))
    ),
}).pipe(Layer.provide([DatabaseLive, NodeContext.layer]));
