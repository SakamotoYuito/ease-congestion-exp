"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { session } from "@/lib/session";
import VerificationComponent from "@/app/ui/verification";
import { getIdToken } from "firebase/auth";

export default function Verification() {
  const router = useRouter();
  const email = `${auth.currentUser?.email?.slice(0, 4)}***@****`;
  try {
    const interval = setInterval(async () => {
      if (auth.currentUser === null) {
        clearInterval(interval);
        router.push("/signup");
      }
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        console.log("currentUser: ", auth.currentUser);
        const id = await getIdToken(auth.currentUser, true);
        await session(id);
        clearInterval(interval);
        router.push("/settings?first=true");
      }
    }, 2000);
  } catch (error) {
    console.log("error: ", error);
  }

  return <VerificationComponent email={email} />;
}
