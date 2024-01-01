"use client";

import { useState, useEffect } from "react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useSearchParams, useRouter } from "next/navigation";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  postCollectionInLogs,
  fetchProgramInfo,
  patchReward,
  patchParticipatedEvents,
} from "@/lib/dbActions";
import { postLogEvent } from "@/lib/firebase/client";
import Image from "next/image";

export default function UploadImage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"detail" | "post">("detail");
  const [content, setContent] = useState("");
  const [process, setProcess] = useState<string[]>([]);
  const [caution, setCaution] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [rewardPoint, setRewardPoint] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [isPushButton, setIsPushButton] = useState(false);
  const programId = searchParams.get("programId") || "";

  useEffect(() => {
    (async () => {
      const programInfo = await fetchProgramInfo(programId);
      setContent(programInfo.content);
      setProcess(programInfo.process);
      setCaution(programInfo.caution);
      setCondition(programInfo.condition);
      setRewardPoint(programInfo.rewardPoint);
    })();
  }, []);

  const uploadToClient = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "hiec",
        "JPG",
        "JPEG",
        "PNG",
        "GIF",
        "HEIC",
      ];
      if (!ext || !allowedExtensions.includes(ext)) {
        setError("許可されていないファイル形式です。");
        return;
      }
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
        initialQuality: 0.85,
        maxWidthOrHeight: 1920,
      };
      const compressedFile = await imageCompression(file, options);
      setPhoto(compressedFile);
      setCreateObjectURL(URL.createObjectURL(file));
    }
  };

  const uploadToServer = async () => {
    if (!photo?.name) {
      setError("写真を選択してください");
      setIsPushButton(false);
      return;
    }
    try {
      const storageRef = ref(storage);
      const ext = photo.name.split(".").pop();
      const hashName = Math.random().toString(36).slice(-8);
      const fullPath = "/images/" + hashName + "." + ext;
      const uploadRef = ref(storageRef, fullPath);
      const place = searchParams.get("place") || "";
      const result = await uploadBytes(uploadRef, photo);
      const uploadUrl = await getDownloadURL(uploadRef);
      const postData = {
        date: new Date(result.metadata.timeCreated),
        url: uploadUrl,
        place: place,
        fullPath: fullPath,
      };
      const resPostPhoto = await fetch("/api/postPhoto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postData }),
      });
      if (resPostPhoto.ok) {
        await patchReward(rewardPoint);
        const title = "写真を投稿しました";
        const state = "postPhoto";
        await postCollectionInLogs(title, place, state);
        await patchParticipatedEvents(`${programId}`);
        postLogEvent("写真投稿成功");
        router.push("/photoalbum");
      } else {
        setError("投稿に失敗しました");
      }
    } catch (error) {
      console.error(error);
      setError("投稿に失敗しました");
      setIsPushButton(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-between pb-20">
      <div className="justify-center mt-24">
        <div className="grid grid-cols-4 text-center border-b-2 border-green-700 m-2">
          <button
            className={`col-start-2 text-lg ${
              tab === "detail"
                ? "bg-green-700 text-white font-bold rounded-t-lg"
                : "text-green-700 underline"
            }`}
            onClick={() => setTab("detail")}
          >
            詳細
          </button>
          <button
            className={`col-start-3 text-lg ${
              tab === "post"
                ? "bg-green-700 text-white font-bold rounded-t-lg"
                : "text-green-700 underline"
            }`}
            onClick={() => setTab("post")}
          >
            投稿
          </button>
        </div>
        {tab === "detail" && (
          <div className="p-2 overflow-auto">
            <p className="text-sm mb-0 text-left">{content}</p>
            <p className="text-lg mb-0 font-bold mt-2">手順</p>
            <div className="mb-2 text-left">
              {process.map((process, index) => (
                <p key={index} className="text-sm mb-0 ml-3">
                  {`${index + 1}. ${process}`}
                </p>
              ))}
            </div>
            <p className="text-lg mb-0 font-bold">注意事項</p>
            <div className="mb-2 text-left">
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
          </div>
        )}
        {tab === "post" && (
          <>
            <div className="flex justify-between items-center w-full p-5">
              <h1 className="text-left text-2xl">新規投稿</h1>
              {isPushButton ? (
                <button className="flex justify-center items-center bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  投稿
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsPushButton(true);
                    uploadToServer();
                  }}
                  className="flex justify-center items-center bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                >
                  投稿
                </button>
              )}
            </div>
            <div className="text-black">
              {createObjectURL && (
                <Image
                  src={createObjectURL}
                  alt="Uploaded image"
                  width={100}
                  height={100}
                  priority
                  className="bg-gray-800 w-full pt-10 pb-10 pr-5 pl-5"
                />
              )}
              <label
                htmlFor="file-input"
                className="flex justify-center items-center px-4 py-2 rounded mb-6 w-full"
              >
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  style={{ width: "25px", height: "25px", margin: "0 5px" }}
                />
                写真を選択する
              </label>
              <input
                id="file-input"
                className="hidden"
                type="file"
                accept="image/*"
                name="myImage"
                onChange={(event) => {
                  setError("");
                  uploadToClient(event);
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full p-5">
              {error !== "" && <p className="text-red-500">{error}</p>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
