import { useFormState } from "react-dom";
import { resetPassword } from "@/lib/authentication";
import { useState } from "react";
import AlertModalComponent from "./alertModal";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

export default function ForgetPasswordComponent() {
  const router = useRouter();
  const [alertModal, setAlertModal] = useState(false);
  const [error, action] = useFormState(resetPassword, initialState);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
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
          <button
            onClick={() => router.push("/login")}
            type="button"
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-700"
          >
            ログイン画面へ戻る
          </button>
          <button
            onClick={() => {
              setAlertModal(true);
              console.log(alertModal);
            }}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            送信
          </button>
        </div>
        <p className="text-red-500">{error?.message}</p>
      </form>
      <p>{alertModal}</p>
      {alertModal && (
        <AlertModalComponent
          title="パスワードリセットを受け付けました。"
          message="メールを確認して、パスワードをリセットしてください。"
          handleOk={() => router.push("/login")}
        />
      )}
    </main>
  );
}
