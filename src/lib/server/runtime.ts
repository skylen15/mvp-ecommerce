import { Layer, ManagedRuntime } from "effect";

import { EnvProviderLayer } from "./env";

export const RuntimeServer = ManagedRuntime.make(
	Layer.mergeAll(EnvProviderLayer),
);
