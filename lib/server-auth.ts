import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth";

export function getSession() {
  return getServerSession(getAuthOptions());
}
