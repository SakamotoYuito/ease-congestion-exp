"use client";

import Link from "next/link";
import { postCollectionInLogs } from "@/lib/dbActions";

type Props = {
  link: string;
  title: string;
};

export default function QuestionnaireComponent({ link, title }: Props) {
  const handleClick = async () => {
    await postCollectionInLogs(
      "アンケート回答クリック",
      "アンケート",
      "アンケート"
    );
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="grid grid-rows-max-content-layout-2 grid-cols-max-content-layout-2 gap-2 p-3">
        <div className="row-start-1 col-start-1 col-end-3 justify-items-center items-center text-center uppercase tracking-wide text-sm text-green-700 font-semibold">
          {title}
        </div>
        <div className="row-start-2 col-start-1 col-end-3 grid place-items-center">
          <Link
            href={link}
            target="_blank"
            className="m-0 text-white no-underline"
          >
            <button
              className="text-sm bg-green-700 py-2 px-4 rounded-md font-bold"
              onClick={handleClick}
            >
              回答する
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
