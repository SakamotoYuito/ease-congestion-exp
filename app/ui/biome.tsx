"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { patchBiomeUserName, fetchBiomeUserName } from "@/lib/dbActions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

export default function BiomeComponent() {
  const [userName, setUserName] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, action] = useFormState(patchBiomeUserName, initialState);
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId") || "";
  const rewardPoint = searchParams.get("rewardPoint") || "";
  const href = `/biome/postbiome?programId=${programId}&rewardPoint=${rewardPoint}`;

  useEffect(() => {
    if (error.message === "success" || userName !== "") {
      setCanSubmit(true);
    }
  }, [error, userName]);

  useEffect(() => {
    (async () => {
      const userName = await fetchBiomeUserName();
      setUserName(userName);
    })();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen pb-40 px-3 w-full text-center mt-52">
      <h1 className="text-2xl font-bold">
        集え！！
        <br />
        デジタル生物調査隊！！！
      </h1>
      <p>
        いきものコレクションアプリ「Biome（バイオーム）」を使って生き物を集めよう!
      </p>
      <p>
        Biomeに生き物を登録したら、そのスクリーンショットと生き物の名前を投稿せよ!
      </p>
      <p className="text-lg font-bold mt-5">Biomeのダウンロードはこちら</p>
      <div className="grid grid-cols-2">
        <Link href="https://apps.apple.com/jp/app/biome-%E3%83%90%E3%82%A4%E3%82%AA%E3%83%BC%E3%83%A0-%E3%81%84%E3%81%8D%E3%82%82%E3%81%AEai%E5%9B%B3%E9%91%91/id1459658355">
          <Image
            src="/apple.png"
            alt="App Store"
            width={300}
            height={200}
            priority
            className="col-start-1 my-2 px-4"
          />
        </Link>
        <Link href="https://play.google.com/store/apps/details?id=jp.co.biome.biome&pli=1">
          <Image
            src="/google-play-badge.png"
            alt="Google Play"
            width={300}
            height={300}
            priority
            className="col-start-2 px-2"
          />
        </Link>
      </div>
      <div>
        <form action={action}>
          <div>
            <label htmlFor="biomeName" className="text-lg font-bold mt-5">
              Biomeアプリのユーザーネーム
            </label>
            <input
              id="biomeName"
              type="text"
              name="biomeName"
              defaultValue={userName}
              className="border-2 border-gray-500 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
          >
            設定
          </button>
        </form>
      </div>
      {canSubmit ? (
        <Link href={href} className="no-underline">
          <button className="m-5 p-10 bg-green-600 w-32 h-32 flex items-center justify-center text-white font-bold text-2xl hover:bg-green-500 py-2 px-4 border-b-8 hover:border-none border-green-700 hover:border-green-500 rounded-full">
            投稿
          </button>
        </Link>
      ) : (
        <div>
          <button className="m-5 p-10 bg-gray-600 w-32 h-32 flex items-center justify-center text-white font-bold text-2xl rounded-full">
            投稿
          </button>
        </div>
      )}
    </main>
  );
}
