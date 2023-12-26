"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { setNewPassword } from "@/lib/authentication";
import AlertModalComponent from "./alertModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { session } from "@/lib/session";
import { applyActionCode } from "firebase/auth";

const initialState = {
  message: "",
};
export default function FirebaseEmailComponent() {
  const searchParams = useSearchParams();
  const [error, action] = useFormState(setNewPassword, initialState);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [isNewPasswordView, setIsNewPasswordView] = useState(false);
  const [isNewPasswordConfirmView, setIsNewPasswordConfirmView] =
    useState(false);
  const [isModeVerifyEmail, setIsModeVerifyEmail] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const effectRef = useRef(false);

  useEffect(() => {
    const oobCode = searchParams.get("oobCode") || "";
    setCode(oobCode);
    if (searchParams.get("mode") === "resetPassword") {
      setLoading(false);
    }
    if (searchParams.get("modal") === "true") {
      setLoading(false);
      setAlertModal(true);
    }
    if (searchParams.get("mode") === "verifyEmail") {
      setLoading(false);
      setIsModeVerifyEmail(true);
      setCode(oobCode);
      !effectRef.current && verifyEmail(oobCode);
    }
    return () => {
      effectRef.current = true;
    };
  }, [searchParams]);

  const verifyEmail = async (oobCode: string) => {
    try {
      await applyActionCode(auth, oobCode);
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        const id = await getIdToken(auth.currentUser, true);
        await session(id);
        setVerifiedEmail(true);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOk = () => {
    setAlertModal(false);
    setResetComplete(true);
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-xl font-bold text-center">読み込み中...</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      {isModeVerifyEmail ? (
        <>
          {verifiedEmail ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-10">
                メールアドレスが認証されました
              </h1>
              <h2 className="text-lg font-bold text-center">
                スマートフォンにインストールした
                <br />
                アプリケーションをご利用ください
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-center">
                メールアドレスの認証中...
              </h1>
            </>
          )}
        </>
      ) : (
        <>
          {resetComplete ? (
            <h1 className="text-xl font-bold">
              スマートフォンにインストールした
              <br />
              アプリケーションをご利用ください
            </h1>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">パスワードリセット</h1>
              <form action={action} className="w-full max-w-xs space-y-4">
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
                      onClick={() =>
                        setIsNewPasswordView((prevState) => !prevState)
                      }
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
                <input type="hidden" name="oobCode" value={code} />
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
                  >
                    送信
                  </button>
                </div>
                <p className="text-red-500 text-center">{error?.message}</p>
              </form>
              {alertModal && (
                <AlertModalComponent
                  title="パスワードが変更されました。"
                  message="インストールしたアプリケーションで新しいパスワードを使用してログインしてください。"
                  handleOk={() => handleOk()}
                />
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
