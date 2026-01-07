import { Effect } from "effect";

import { auth } from "@/lib/server/auth";
import {
    BanUserSchema,
    DeleteUserSchema,
    ListUserOptionSchema,
    NewUserSchema,
    SetUserPasswordSchema,
    SetUserRoleSchema,
    UnbanUserSchema,
    UpdateUserSchema,
} from "../schema";

export class UserService extends Effect.Service<UserService>()(
    "mvp-ecommerce/features/admin/services/user.service/UserService",
    {
        effect: Effect.gen(function* () {
            return {} as const;
        }),
    }
) {}
