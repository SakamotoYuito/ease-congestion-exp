"use client";

import LoginComponent from "../ui/login";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";

export default function Login() {
  useEffect(() => {
    const initialize = async () => {
      await auth.authStateReady();
    };
    initialize();
  });
  return (
    <div>
      <LoginComponent />
    </div>
  );
}
