import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      tier?: "FREE" | "PRO";
      freeUsed?: boolean;
      subEndsAt?: Date | null;
    };
  }
}
