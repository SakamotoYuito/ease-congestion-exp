"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { reSendEmailVerification } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function Verification() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user: ", user?.emailVerified || "no user");
      if (user?.emailVerified) {
        router.push("/");
      }
    });
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(interval);
        router.push("/");
      }
    });
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-4 bg-white rounded shadow-xl">
          <h2 className="text-2xl font-bold mb-4">メールアドレスの認証中</h2>
          <p className="mb-4">
            メール内のリンクをクリックしてユーザーを有効化してください。
          </p>
          <button
            onClick={reSendEmailVerification}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            再送する
          </button>
        </div>
      </div>
    </div>
  );
}
