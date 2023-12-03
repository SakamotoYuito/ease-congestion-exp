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
  const sessionId = cookies().get("session");
  if (!sessionId) return null;
  const decodedToken = await auth
    .verifySessionCookie(sessionId?.value, true)
    .catch((error: Error) => console.log(error));

  if (decodedToken) {
    await auth.revokeRefreshTokens(decodedToken.sub);
  }

  cookies().delete("session");
}

export async function getUidFromCookie() {
  const hasSession = cookies().has("session");
  if (!hasSession) return null;
  const sessionId = cookies().get("session");
  const decodedToken = await auth
    .verifySessionCookie(sessionId?.value, true)
    .catch((error: Error) => console.log("getUidFromCookie", error));
  return decodedToken;
}
