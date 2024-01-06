"use client";

import { useState } from "react";

type Props = {
  info: {
    modalTitle: string;
    mainMessage: string;
    subMessage?: string;
    leftTitle: string;
    rightTitle: string;
    leftOnClick: () => void;
    rightOnClick: () => void;
  };
};

export default function ModalComponent({ info }: Props) {
  const [leftClicked, setLeftClicked] = useState(false);
  const [rightClicked, setRightClicked] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-4 bg-white rounded shadow-xl">
        <h2 className="text-2xl font-bold mb-4">{info.modalTitle}</h2>
        <p className="mb-4">{info.mainMessage}</p>
        {info.subMessage !== undefined && (
          <p className="mb-4">{info.subMessage}</p>
        )}
        <div className="flex space-x-4">
          {!leftClicked ? (
            <button
              onClick={() => {
                setLeftClicked(true);
                info.leftOnClick();
              }}
              className="px-4 py-2 bg-white text-green-700 border border-green-700 rounded hover:bg-gray-500"
            >
              {info.leftTitle}
            </button>
          ) : (
            <button className="px-4 py-2 bg-gray-500 text-white border border-green-700 rounded">
              {info.leftTitle}
            </button>
          )}
          {!rightClicked ? (
            <button
              onClick={() => {
                setRightClicked(true);
                info.rightOnClick();
              }}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
            >
              {info.rightTitle}
            </button>
          ) : (
            <button className="px-4 py-2 bg-green-900 text-white rounded">
              {info.rightTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
