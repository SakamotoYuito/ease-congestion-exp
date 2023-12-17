"use client";

import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
import { postCollectionInLogs } from "@/lib/dbActions";

export default function BarcodeScanner() {
  const router = useRouter();
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  useEffect(() => {
    console.log("result: ", result);
    if (result === "") return;
    const url = new URL(result);
    const params = new URLSearchParams(url.search);
    const title = params.get("title") || "";
    const place = params.get("place") || "";
    const state = "QRコード読み取り";
    console.log("params: ", params);
    (async () => {
      await postCollectionInLogs(title, place, state);
    })();
    router.push(result);
  }, [result]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
      <div className="justify-center mt-24">
        <h1 className="text-2xl font-bold mb-4">QRコードリーダー</h1>
        <video ref={ref} className="m-auto w-full h-22" />
        <p className="pt-5 pl-5 pr-5">QRコードを読み取ってください</p>
        <p className="pt-5 pl-5 pr-5">
          カメラが起動しない場合は、ブラウザの設定からカメラを許可してください。
        </p>
      </div>
    </main>
  );
}
