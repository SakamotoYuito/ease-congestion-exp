"use client";

import { useState } from "react";
import Link from "next/link";

type Board = {
  info: {
    title: string;
    message: string;
    buttonTitle: string;
    link: string;
  };
};

export default function BoardComponent({ info }: Board) {
  const [canceled, setCanceled] = useState(false);
  const [leftClicked, setLeftClicked] = useState(false);
  const [rightClicked, setRightClicked] = useState(false);

  return (
    <>
      {canceled ? (
        <></>
      ) : (
        <div className="bg-gray-700 bg-opacity-80 fixed top-0 left-0 w-full h-full">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="p-4 bg-white rounded shadow-xl flex flex-col w-11/12 items-center justify-center">
              <h2 className="text-lg font-bold mb-2">{info.title}</h2>
              <p className="mb-4">{info.message}</p>
              <div className="flex space-x-4">
                {!leftClicked ? (
                  <button
                    onClick={() => {
                      setLeftClicked(true);
                      setCanceled(true);
                    }}
                    className="px-4 py-2 bg-white text-green-700 border border-green-700 rounded hover:bg-gray-500"
                  >
                    キャンセル
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-gray-500 text-white border border-green-700 rounded">
                    キャンセル
                  </button>
                )}
                {!rightClicked ? (
                  <Link href={info.link} target="_blank">
                    <button
                      onClick={() => {
                        setRightClicked(true);
                      }}
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
                    >
                      {info.buttonTitle}
                    </button>
                  </Link>
                ) : (
                  <button className="px-4 py-2 bg-green-900 text-white rounded">
                    {info.buttonTitle}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
