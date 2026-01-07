import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL!,
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: "uuid",
        },
    },
    plugins: [
        openAPI(),
        admin({
            impersonationSessionDuration: 60 * 60 * 24, // 1 day
        }),
    ],
});
