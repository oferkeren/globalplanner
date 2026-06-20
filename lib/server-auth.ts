import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createServerAuthOptions(): NextAuthOptions {
  return {
    secret: requiredEnv("NEXTAUTH_SECRET"),
    session: {
      strategy: "jwt",
    },
    providers: [
      GoogleProvider({
        clientId: requiredEnv("GOOGLE_CLIENT_ID"),
        clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      }),
    ],
  };
}

export function getSession() {
  return getServerSession(createServerAuthOptions());
}
