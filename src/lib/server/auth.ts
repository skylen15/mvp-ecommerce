import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";

import { pool } from "./db/pool";

export const auth = betterAuth({
	database: pool,
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
