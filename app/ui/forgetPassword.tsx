"use client";

import { useFormState } from "react-dom";
import { sendEmailToResetPassword } from "@/lib/authentication";
import { useState } from "react";
import AlertModalComponent from "./alertModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const initialState = {
  message: "",
};

export default function ForgetPasswordComponent() {
  const router = useRouter();
  const [alertModal, setAlertModal] = useState(false);
  const [error, action] = useFormState(sendEmailToResetPassword, initialState);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="grid grid-cols-3 items-center shadow-md fixed top-0 w-full z-10 bg-white h-20">
        <div className="col-start-2 font-mono text-xl place-content-center text-center w-full">
          <Image src="/title.png" width={180} height={80} alt="title" />
        </div>
        <div className="col-start-3 font-mono text-sm justify-self-end mr-3">
          <div className="text-lg"></div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">パスワードリセット</h1>
      <form action={action} className="w-full max-w-xs space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2">
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between">
          <Link href="/login">
            <button
              onClick={() => router.push("/login")}
              type="button"
              className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-700"
            >
              ログイン画面へ戻る
            </button>
          </Link>
          <button
            onClick={() => setAlertModal(true)}
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
          >
            送信
          </button>
        </div>
        <p className="text-red-500">{error?.message}</p>
      </form>
      <p>{alertModal}</p>
      {alertModal && (
        <>
          {!error && (
            <AlertModalComponent
              title="パスワードリセットを受け付けました。"
              message="メールを確認して、パスワードをリセットしてください。"
              handleOk={() => router.push("/login")}
            />
          )}
        </>
      )}
    </main>
  );
}
