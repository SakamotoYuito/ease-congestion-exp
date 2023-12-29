"use client";

import { useState, useEffect } from "react";
import {
  fetchCurrentPlace,
  patchCurrentPlace,
  patchReward,
  patchParticipatedEvents,
} from "@/lib/dbActions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function WalkComponent() {
  const [isWalking, setIsWalking] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const reward = searchParams.get("rewardPoint") || "";
  const programId = searchParams.get("programId") || "";

  useEffect(() => {
    (async () => {
      const currentPlace = await fetchCurrentPlace();
      if (currentPlace === "walking") {
        setIsWalking(true);
        setIsFinished(false);
      } else if (currentPlace === "Home") {
        setIsFinished(true);
        setIsWalking(false);
      } else {
        setIsWalking(false);
        setIsFinished(false);
      }
    })();
  }, []);

  const handleStartWalking = () => {
    (async () => {
      await patchCurrentPlace("walking");
      setIsWalking(true);
    })();
  };

  const handleFinishWalking = () => {
    (async () => {
      await patchParticipatedEvents(programId);
      await patchCurrentPlace("Home");
      await patchReward(reward);
      setIsWalking(false);
      setIsFinished(true);
    })();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-3">
      <h2 className="text-2xl font-bold">今日は歩いて帰ろう！</h2>
      <p className="text-lg">
        健康のために上賀茂の緑を楽しみながら、歩いて帰りませんか？（自転車も可）
      </p>
      {isWalking === null || isFinished === null ? (
        <p className="text-sm text-green-700 font-bold m-0 p-2">
          読み込み中...
        </p>
      ) : (
        <>
          {!isWalking && !isFinished && (
            <button
              onClick={handleStartWalking}
              className="text-sm bg-green-700 p-2 rounded-md text-white"
            >
              今から歩いて帰る
            </button>
          )}
          {isWalking && (
            <>
              <p className="text-sm text-green-700 font-bold m-0 p-2">
                帰宅中...
              </p>
              <button
                onClick={handleFinishWalking}
                className="text-sm bg-green-700 p-2 rounded-md text-white"
              >
                帰宅したら押してください
              </button>
            </>
          )}
          {isFinished && (
            <Link href="/">
              <button className="text-sm bg-green-700 p-2 rounded-md no-underline text-white">
                お疲れ様でした（ホームに戻る）
              </button>
            </Link>
          )}
        </>
      )}
    </main>
  );
}
