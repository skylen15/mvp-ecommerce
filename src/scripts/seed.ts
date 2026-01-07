import { SqlClient, SqlResolver } from "@effect/sql";
import { DateTime, Effect, Option, Schema } from "effect";

import {
    Account,
    InserUserSchema,
    User,
    UserIdSchema,
} from "@/features/auth/schema";
import { EnvConfig } from "@/lib/server/configs";
import { RuntimeServer } from "@/lib/server/runtime";
import { hashPassword } from "better-auth/crypto";

Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const config = yield* EnvConfig;

    const GetByEmail = yield* SqlResolver.findById("GetByEmail", {
        Id: Schema.String,
        Result: User,
        ResultId: (_) => _.email,
        execute: (emails) =>
            sql`SELECT * FROM "user" WHERE ${sql.in("email", emails)}`,
    });

    const adminExists = Option.getOrNull(
        yield* GetByEmail.execute(config.admin.email)
    );

    if (adminExists) {
        yield* Effect.logWarning("Admin user already exists");
        return;
    }

    const InsertUser = yield* SqlResolver.ordered("InsertUser", {
        Request: InserUserSchema,
        Result: User,
        execute: (request) =>
            sql`INSERT INTO "user" ${sql.insert(request)} RETURNING *`,
    }).pipe(Effect.withSpan("InsertUser"));

    const adminUser = yield* InsertUser.execute({
        name: config.admin.name,
        email: config.admin.email,
        role: "admin",
        emailVerified: false,
    });

    const InsertAccount = yield* SqlResolver.ordered("InsertAccount", {
        Request: Account.pipe(Schema.omit("id")),
        Result: Account,
        execute: (request) =>
            sql`INSERT INTO "account" ${sql.insert(request)} RETURNING *`,
    });

    yield* InsertAccount.execute({
        userId: UserIdSchema.make(adminUser.id),
        accountId: UserIdSchema.make(adminUser.id),
        password: yield* Effect.promise(() =>
            hashPassword(config.admin.password)
        ),
        providerId: "credential",
        updatedAt: yield* DateTime.now.pipe(Effect.map(DateTime.toDateUtc)),
    });

    yield* Effect.log("Admin user created");
}).pipe(
    Effect.catchTags({
        ParseError: (error) => Effect.logError(`ParseError: ${error.message}`),
        SqlError: (error) => Effect.logError(`SqlError`, error),
        ResultLengthMismatch: (error) =>
            Effect.logError(`ResultLengthMismatch: ${error.message}`),
    }),
    RuntimeServer.runPromise
);
