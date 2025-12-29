import { PlatformConfigProvider } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { Config, Effect, Equal, Layer, Redacted } from "effect";

export const EnvProviderLayer = Layer.unwrapEffect(
	PlatformConfigProvider.fromDotEnv(".env").pipe(
		Effect.map(Layer.setConfigProvider),
		Effect.provide(NodeFileSystem.layer),
	),
);

export class EnvConfig extends Effect.Service<EnvConfig>()(
	"mvp-ecommerce/lib/server/configs/EnvConfig",
	{
		dependencies: [EnvProviderLayer],
		effect: Effect.gen(function* () {
			const isDev = Equal.equals(
				yield* Config.string("NODE_ENV"),
				"development",
			);

			return {
				databaseUrl: Redacted.value(
					yield* Effect.if(isDev, {
						onTrue: () => Config.redacted("DEV_DB_URL"),
						onFalse: () => Config.redacted("PROD_DB_URL"),
					}),
				),
				admin: {
					email: Redacted.value(
						yield* Config.redacted("ADMIN_EMAIL"),
					),
					password: Redacted.value(
						yield* Config.redacted("ADMIN_PASSWORD"),
					),
					name: yield* Config.string("ADMIN_NAME"),
				},
			} as const;
		}),
	},
) {}
