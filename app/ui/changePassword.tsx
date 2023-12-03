"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { changePassword } from "@/lib/firebase/client";
import AlertModalComponent from "./alertModal";

const initialState = {
  message: "",
};

export default function ChangePasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alertModal, setAlertModal] = useState(false);
  const [error, action] = useFormState(changePassword, initialState);

  useEffect(() => {
    const handleQueryChange = () => {
      if (searchParams.get("modal") === "true") {
        setAlertModal(true);
      }
    };
    return handleQueryChange();
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">パスワード変更</h1>
      <form action={action} className="w-full max-w-xs space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2">
            現在のパスワード:
          </label>
          <input
            id="oldPassword"
            type="password"
            name="oldPassword"
            placeholder="Enter your current password"
            required
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            新しいパスワード:
          </label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            required
            minLength={6}
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            新しいパスワード(再入力):
          </label>
          <input
            id="newPasswordConfirm"
            type="password"
            name="newPasswordConfirm"
            placeholder="Enter your new password again"
            required
            minLength={6}
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => router.push("/")}
            type="button"
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-700"
          >
            戻る
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            送信
          </button>
        </div>
        <p className="text-red-500 text-center">{error?.message}</p>
      </form>
      {alertModal && (
        <AlertModalComponent
          title="パスワード変更完了"
          handleOk={() => router.push("/")}
        />
      )}
    </main>
  );
}
