import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name || undefined,
          image: user.image || undefined,
        },
        create: {
          email: user.email,
          name: user.name || undefined,
          image: user.image || undefined,
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
  },
};
