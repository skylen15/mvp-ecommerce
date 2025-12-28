import { Layer, ManagedRuntime } from "effect";

import { DbORM } from "./db/orm";
import { EnvProviderLayer } from "./env";

export const RuntimeServer = ManagedRuntime.make(
	Layer.mergeAll(DbORM.Default, EnvProviderLayer),
);
