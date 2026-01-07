/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        user:
            | (import("better-auth").User & {
                  role: "admin" | "user" | ("user" | "admin")[];
                  banned: boolean | null;
                  banReason: string | null;
                  banExpires: Date | null;
              })
            | null;
        session:
            | (import("better-auth").Session & {
                  impersonatedBy: string | null;
              })
            | null;
    }
}
