"use client";

import { analytics } from "@/lib/firebase/client";
import LoginComponent from "../ui/login";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { logEvent } from "firebase/analytics";

export default function Login() {
  useEffect(() => {
    const initialize = async () => {
      await auth.authStateReady();
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
