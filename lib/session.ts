"use server";

import { cookies } from "next/headers";
import { auth } from "./firebase/server";
import { redirect } from "next/navigation";

export async function session(id: string) {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(id, { expiresIn });

    const option = {
      maxAge: expiresIn,
      secure: true,
      httpOnly: true,
      path: "/",
    };

    cookies().set("session", sessionCookie, option);
  } catch (error) {
    console.log("session", error);
  }
}

export async function sessionLogout() {
  let canLogout = false;
  try {
    const hasSession = cookies().has("session");
    if (!hasSession) return;
    const session = cookies().get("session");
    const decodedToken = await auth.verifySessionCookie(session?.value, true);
    if (decodedToken) await auth.revokeRefreshTokens(decodedToken.sub);
    cookies().delete("session");
    canLogout = true;
  } catch (error) {
    console.log(error);
    return;
  }
  canLogout && redirect("/login");
}

export async function getUserFromCookie(): Promise<any | null> {
  try {
    const hasSession = cookies().has("session");
    if (!hasSession) return null;
    const sessionId = cookies().get("session");
    const decodedToken = await auth.verifySessionCookie(sessionId?.value, true);
    if (!decodedToken) return null;
    return decodedToken;
  } catch (error) {
    return null;
  }
}
