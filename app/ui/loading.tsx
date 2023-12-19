"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchQrInfo,
  fetchProgramInfo,
  patchReward,
  patchCheckinProgramIds,
  patchCheckoutProgramIds,
  postCollectionInLogs,
} from "@/lib/dbActions";

export default function LoadingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    (async () => {
      const qrId = searchParams.get("id") || "";
      console.log("qrId: ", qrId);
      const qrInfo = await fetchQrInfo(qrId);
      const programTitle = await fetchProgramInfo(`${qrInfo.programId}`);
      setTitle(programTitle.title);
      setContent(programTitle.content);
      const place = `${qrInfo.placeId}-${qrInfo.placeNumber}`;
      await postCollectionInLogs(programTitle.title, place, "QRコード読み取り");
      if (qrInfo.type === "checkin") {
        await patchReward(`${qrInfo.rewardPoint}`);
        await patchCheckinProgramIds(`${qrInfo.programId}`);
        setCheckin(true);
      } else if (qrInfo.type === "checkout") {
        await patchReward(`${qrInfo.rewardPoint}`);
        await patchCheckoutProgramIds(`${qrInfo.programId}`);
        setCheckout(true);
      } else {
        await patchReward(`${qrInfo.rewardPoint}`);
        router.push(
          `${qrInfo.type}?programId=${qrInfo.programId}&place=${place}`
        );
      }
    })();
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      {!checkin && !checkout && (
        <div className="flex min-h-screen flex-col items-center justify-between pb-20">
          <h1 className="text-3xl font-bold text-center mb-10">Loading...</h1>
        </div>
      )}
      {checkin && (
        <div className="flex min-h-screen flex-col items-center justify-center pb-20">
          <h1 className="text-2xl font-bold text-center mb-10">
            {title}
            <br />
            に
            <br />
            チェックインしました
          </h1>
          <h1 className="text-lg font-bold text-center mb-10">
            ホーム画面からいつでも確認できます
          </h1>
          <p className="text-sm text-center mb-10">{content}</p>
        </div>
      )}
      {checkout && (
        <div className="flex min-h-screen flex-col items-center justify-center pb-20">
          <h1 className="text-2xl font-bold text-center mb-10">
            {title}
            <br />
            から
            <br />
            チェックアウトしました
          </h1>
          <h1 className="text-sm font-bold text-center mb-10">
            ご参加ありがとうございました。
            <br />
            獲得した報酬はホーム画面から確認できます。
          </h1>
        </div>
      )}
    </main>
  );
}
