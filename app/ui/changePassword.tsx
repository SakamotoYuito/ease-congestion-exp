"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { changePassword } from "@/lib/authentication";
import AlertModalComponent from "./alertModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const initialState = {
  message: "",
};

export default function ChangePasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alertModal, setAlertModal] = useState(false);
  const [isOldPasswordView, setIsOldPasswordView] = useState(false);
  const [isNewPasswordView, setIsNewPasswordView] = useState(false);
  const [isNewPasswordConfirmView, setIsNewPasswordConfirmView] =
    useState(false);
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
          <div className="relative">
            <input
              id="oldPassword"
              type={isOldPasswordView ? "text" : "password"}
              name="oldPassword"
              placeholder="現在のパスワードを入力"
              required
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span
              onClick={() => setIsOldPasswordView((prevState) => !prevState)}
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
            >
              {isOldPasswordView ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            新しいパスワード:
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={isNewPasswordView ? "text" : "password"}
              name="newPassword"
              placeholder="新しいパスワードを入力"
              required
              minLength={6}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span
              onClick={() => setIsNewPasswordView((prevState) => !prevState)}
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
            >
              {isNewPasswordView ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            新しいパスワード(確認用):
          </label>
          <div className="relative">
            <input
              id="newPasswordConfirm"
              type={isNewPasswordConfirmView ? "text" : "password"}
              name="newPasswordConfirm"
              placeholder="新しいパスワードを入力(確認用)"
              required
              minLength={6}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span
              onClick={() =>
                setIsNewPasswordConfirmView((prevState) => !prevState)
              }
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
            >
              {isNewPasswordConfirmView ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
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
