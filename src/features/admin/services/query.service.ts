import { hashPassword } from "better-auth/crypto";
import { DateTime, Effect, flow } from "effect";

import { Account, User } from "@/features/auth/schema";
import { UserIdSchema } from "@/lib/server/schema";
import { singleResult } from "@/lib/server/utils";

export class AdminQueries extends Effect.Service<AdminQueries>()(
    "mvp-ecommerce/features/admin/services/queries/AdminQueries",
    {
        effect: Effect.gen(function* () {
            // {
            //     createUser,
            //     createAccount,
            //     createAdmin,

            //     checkAdminExists,
            // }

            return {} as const;
        }),
    }
) {}
