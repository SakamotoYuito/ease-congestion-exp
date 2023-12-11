"use server";

import { cookies } from "next/headers";
import { auth } from "./firebase/server";

export async function session(id: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(id, { expiresIn });

  const option = {
    maxAge: expiresIn,
    secure: true,
    httpOnly: true,
    path: "/",
  };

  cookies().set("session", sessionCookie, option);
}

export async function sessionLogout() {
  const hasSession = cookies().has("session");
  if (!hasSession) return null;
  const session = cookies().get("session")?.value;
  const decodedToken = await auth.verifySessionCookie(session, true);
  if (decodedToken) await auth.revokeRefreshTokens(decodedToken.sub);
  cookies().delete("session");
}

export async function getUserFromCookie(): Promise<any | null> {
  const hasSession = cookies().has("session");
  if (!hasSession) return null;
  const sessionId = cookies().get("session");
  const decodedToken = await auth.verifySessionCookie(sessionId?.value, true);
  if (!decodedToken) return null;
  return decodedToken;
}

export async function verifyExistUser() {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      await sessionLogout();
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
