import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { getRequiredEnv } from "./env";

export const serverAuthOptions: NextAuthOptions = {
  secret: getRequiredEnv("NEXTAUTH_SECRET"),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
};

export function getSession() {
  return getServerSession(serverAuthOptions);
}
