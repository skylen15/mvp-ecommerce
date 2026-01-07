import { Layer, Logger, ManagedRuntime } from "effect";

import { AdminQueries } from "@/features/admin/services";
import { MigratorLive } from "@/scripts/migrator";
import { EnvConfig } from "./configs";
import { DatabaseLive } from "./db/database";

export const RuntimeServer = ManagedRuntime.make(
    Layer.mergeAll(
        DatabaseLive,
        MigratorLive,
        EnvConfig.Default,
        AdminQueries.Default
    )
);
