"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import SubmitButton from "./submitButton";
import { login } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

const initialState = {
  message: "",
};

export default function LoginComponent() {
  const [error, action] = useFormState(login, initialState);
  const [isPasswordView, setIsPasswordView] = useState(false);
  const router = useRouter();

  const togglePassword = () => {
    setIsPasswordView((prevState) => !prevState);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="grid grid-cols-3 items-center shadow-md fixed top-0 w-full z-10 bg-white h-20">
        <div className="col-start-2 font-mono text-xl place-content-center text-center w-full">
          <Image src="/title.jpg" width={160} height={65} alt="title" />
        </div>
        <div className="col-start-3 font-mono text-sm justify-self-end mr-3">
          <div className="text-lg"></div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mt-4 mb-4">ログイン</h1>
      <form action={action} className="w-full max-w-xs space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2">
            メールアドレス:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="メールアドレスを入力"
            required
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            パスワード:
          </label>
          <div className="relative">
            <input
              id="password"
              type={isPasswordView ? "text" : "password"}
              name="password"
              placeholder="パスワードを入力"
              required
              minLength={6}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span
              onClick={togglePassword}
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
            >
              {isPasswordView ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <SubmitButton title="ログイン" />
          <p className="text-red-500">{error?.message}</p>
        </div>
      </form>
      <div className="mt-4">
        <Link href="/signup">
          <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            新規登録画面はこちら
          </button>
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/forgetpassword">
          <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            パスワードを忘れた方はこちら
          </button>
        </Link>
      </div>
    </main>
  );
}
