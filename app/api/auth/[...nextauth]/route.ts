import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getRequiredEnv } from "@/lib/env";

const authOptions: NextAuthOptions = {
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
