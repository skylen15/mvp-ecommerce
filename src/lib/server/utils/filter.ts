import { Array, Effect, pipe } from "effect";

export const singleResult = <A, E>(orFail: () => E) =>
	Effect.flatMap((results: A[]) =>
		pipe(results, Array.head, Effect.mapError(orFail)),
	);
