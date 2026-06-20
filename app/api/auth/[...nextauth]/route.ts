import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createAuthOptions(): NextAuthOptions {
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
    callbacks: {
      async signIn({ user }) {
        if (!user.email) return false;

        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
        });

        return true;
      },
      async session({ session }) {
        return session;
      },
    },
    pages: {
      signIn: "/",
      error: "/auth-error",
    },
  };
}

async function handler(request: Request, context: any) {
  const nextAuthHandler = NextAuth(createAuthOptions());
  return nextAuthHandler(request, context);
}

export { handler as GET, handler as POST };
