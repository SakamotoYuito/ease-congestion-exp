"use client";

import { useState } from "react";
import Image from "next/image";

export default function InstallMethodComponent() {
  const [os, setOs] = useState("iOS");
  return (
    <div>
      <div className="grid grid-cols-4 text-center border-b-2 border-gray-500 m-2">
        <button
          className={`col-start-2 text-lg ${
            os === "iOS"
              ? "bg-gray-500 text-white font-bold rounded-t-lg"
              : "text-blue-500 underline"
          }`}
          onClick={() => setOs("iOS")}
        >
          iOS
        </button>
        <button
          className={`col-start-3 text-lg ${
            os === "Android"
              ? "bg-gray-500 text-white font-bold rounded-t-lg"
              : "text-blue-500 underline"
          }`}
          onClick={() => setOs("Android")}
        >
          Android
        </button>
      </div>
      <div className="col-start-1 col-end-4">
        {os === "iOS" ? (
          <div className="ml-5">
            <ol>
              <li className="text-lg list-decimal mb-3">
                iOS 16.4以降をお使いください
              </li>
              <li className="text-lg list-decimal mb-3">
                Safariでアプリケーションを開く
              </li>
              <li className="text-lg list-decimal mb-3">
                <div className="">
                  画面下にある共有ボタンをタップ
                  <div className="w-5 h-auto mx-2">
                    <Image
                      src="/share.png"
                      alt="共有ボタン"
                      width={20}
                      height={20}
                      className="align-middle"
                    />
                  </div>
                </div>
              </li>
              <li className="text-lg list-decimal mb-3">
                ホーム画面に追加をタップ
              </li>
              <li className="text-lg list-decimal">画面の指示に従って追加</li>
            </ol>
          </div>
        ) : (
          <div className="ml-5">
            <ol>
              <li className="text-lg list-decimal mb-3">
                Chromeでアプリケーションを開く
              </li>
              <li className="text-lg list-decimal mb-3">
                [インストール]をタップ
              </li>
              <li className="text-lg list-decimal">画面の指示に従って追加</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
