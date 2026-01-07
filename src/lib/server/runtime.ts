import { Layer, ManagedRuntime } from "effect";

import { AdminQueries } from "@/features/admin/services";
import { EnvConfig } from "./configs";
import { DbORM } from "./db/orm";

export const RuntimeServer = ManagedRuntime.make(
    Layer.mergeAll(DbORM.Default, EnvConfig.Default, AdminQueries.Default)
);
