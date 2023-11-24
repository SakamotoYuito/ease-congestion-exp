"use client";

import { sample } from "@/lib/actions";
import TestComponent from "../ui/test";
import { useRouter } from "next/navigation";
import { getUidFromCookie } from "@/lib/session";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import LogoutComponent from "../ui/logout";

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await auth.authStateReady();
      const uid = auth.currentUser?.uid || "";
      console.log("test: ", uid);
      const cookie = await getUidFromCookie();
      console.log("cookie: ", cookie);
      if (uid == "") {
        console.log("test: undefined");
        router.push("/login");
      }
    };
    initialize();
  });
  return (
    <div>
      <TestComponent action={sample} />
      <LogoutComponent />
    </div>
  );
}
