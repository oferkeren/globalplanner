import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

async function authHandler(request: Request, context: any) {
  const handler = NextAuth(getAuthOptions());
  return handler(request, context);
}

export { authHandler as GET, authHandler as POST };
