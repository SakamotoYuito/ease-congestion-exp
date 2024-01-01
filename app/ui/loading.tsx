"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchQrInfo,
  fetchProgramInfo,
  patchReward,
  patchCheckinProgramIds,
  patchCheckoutProgramIds,
  postCollectionInLogs,
  fetchParticipatedEvents,
  patchParticipatedEvents,
  patchCurrentPlace,
} from "@/lib/dbActions";
import { LoadingAnimation } from "./skeletons";
import Link from "next/link";
import { useBudouX } from "../hooks/useBudouX";

export default function LoadingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [process, setProcess] = useState<string[]>([]);
  const [caution, setCaution] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const ref = useRef(false);
  const [participated, setParticipated] = useState(false);
  const { parse } = useBudouX();

  useEffect(() => {
    if (ref.current) return;
    (async () => {
      const qrId = searchParams.get("id") || "";
      const qrInfo = await fetchQrInfo(qrId);
      const programInfo = await fetchProgramInfo(`${qrInfo.programId}`);
      setTitle(programInfo.title);
      setContent(programInfo.content);
      setProcess(programInfo.process);
      setCaution(programInfo.caution);
      setCondition(programInfo.condition);
      const place = `${qrInfo.placeId}-${qrInfo.placeNumber}`;
      await postCollectionInLogs(programInfo.title, place, "QRコード読み取り");
      await patchCurrentPlace(place);
      const participatedEvents = await fetchParticipatedEvents();
      if (qrInfo.type === "checkin") {
        // if (participatedEvents[Number(qrId)] > 0) {
        //   setParticipated(true);
        //   return;
        // }
        // await patchReward(`${qrInfo.rewardPoint}`);
        // await patchCheckinProgramIds(`${qrInfo.programId}`);
        setCheckin(true);
        setLink(
          programInfo.link === null
            ? "/"
            : `${programInfo.link}?programId=${qrInfo.programId}&rewardPoint=${programInfo.rewardPoint}`
        );
        await patchParticipatedEvents(qrId);
      } else if (qrInfo.type === "checkout") {
        if (participatedEvents[Number(qrId)] > 0) {
          setParticipated(true);
          return;
        }
        await patchReward(`${qrInfo.rewardPoint}`);
        await patchCheckoutProgramIds(`${qrInfo.programId}`);
        await patchParticipatedEvents(qrId);
        setCheckout(true);
      } else {
        if (participatedEvents[Number(qrId)] > 0) {
          setParticipated(true);
          return;
        }
        await patchReward(`${qrInfo.rewardPoint}`);
        router.push(
          `${qrInfo.type}?programId=${qrInfo.programId}&place=${place}&rewardPoint=${programInfo.rewardPoint}`
        );
      }
    })();
    return () => {
      ref.current = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      {participated ? (
        <div className="flex min-h-screen flex-col items-center justify-center pb-20">
          <h1 className="text-2xl font-bold text-center mb-10">
            このQRコードからは
            <br />
            参加済みです
          </h1>
          <Link href="/" className="no-underline">
            <button className="flex justify-center items-center bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
              ホームに戻る
            </button>
          </Link>
        </div>
      ) : (
        <>
          {!checkin && !checkout && (
            <div className="flex min-h-screen flex-col items-center justify-between pb-20">
              <LoadingAnimation />
            </div>
          )}
          {checkin && (
            <div className="flex min-h-screen flex-col items-center  mt-24 pb-20">
              <h1 className="text-xl font-bold text-center mb-3">
                {title}
                <br />
                にチェックインしました
              </h1>
              <h1 className="text-lg font-bold text-center mb-2">
                ホーム画面からいつでも確認できます
              </h1>
              <p className="text-lg mb-0 font-bold">手順</p>
              <div className="mb-2 text-left">
                {process.map((process, index) => (
                  <p key={index} className="text-sm mb-0 ml-3">
                    {`${index + 1}. ${process}`}
                  </p>
                ))}
              </div>
              <p className="text-lg mb-0 font-bold">注意事項</p>
              <div className="mb-2">
                {caution.map((caution, index) => (
                  <p key={index} className="text-sm mb-0 ml-3">
                    {caution}
                  </p>
                ))}
              </div>
              <p className="text-lg mb-0 font-bold">付与条件</p>
              <div className="mb-2">
                {condition.map((condition, index) => (
                  <p key={index} className="text-sm mb-0 ml-3">
                    {condition}
                  </p>
                ))}
              </div>
              <Link href={link} className="no-underline">
                <button className="flex justify-center items-center bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                  イベント詳細
                </button>
              </Link>
            </div>
          )}
          {checkout && (
            <div className="flex min-h-screen flex-col items-center justify-center pb-20">
              <h1 className="text-2xl font-bold mb-10 text-center">
                {parse(title)}
              </h1>
              <h1 className="text-lg font-bold text-center mb-10">
                ご参加
                <br />
                ありがとうございます
              </h1>
              <h1 className="text-sm font-bold text-center mb-10">
                獲得した報酬はホーム画面から確認できます。
              </h1>
            </div>
          )}
        </>
      )}
    </main>
  );
}
