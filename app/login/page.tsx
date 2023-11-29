"use client";

import { analytics } from "@/lib/firebase/client";
import LoginComponent from "../ui/login";
import { getUidFromCookie } from "@/lib/session";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { logEvent } from "firebase/analytics";

export default function Login() {
  useEffect(() => {
    const initialize = async () => {
      await auth.authStateReady();
      const uid = auth.currentUser?.uid || "";
      console.log("uid: ", uid);
      const cookie = await getUidFromCookie();
      console.log("cookie: ", cookie);
      logEvent(analytics, "login_authStateReady");
    };
    initialize();
  });
  return (
    <div>
      <LoginComponent />
    </div>
  );
}
