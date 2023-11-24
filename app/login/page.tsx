"use client";

import { getCurrentUser } from "@/lib/firebase/client";
import LoginComponent from "../ui/login";
import { getUidFromCookie } from "@/lib/session";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";

export default function Login() {
  const user = getCurrentUser();
  useEffect(() => {
    const initialize = async () => {
      await auth.authStateReady();
      const uid = auth.currentUser?.uid || "";
      console.log("uid: ", uid);
      const cookie = await getUidFromCookie();
      console.log("cookie: ", cookie);
    };
    initialize();
  });
  return (
    <div>
      <LoginComponent />
      {user?.uid}
    </div>
  );
}
