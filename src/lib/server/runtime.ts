import { Layer, ManagedRuntime } from "effect";

import { EnvConfig } from "./configs";
import { DbORM } from "./db/orm";

export const RuntimeServer = ManagedRuntime.make(
	Layer.mergeAll(DbORM.Default, EnvConfig.Default),
);
