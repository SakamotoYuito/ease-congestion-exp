"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useSearchParams, useRouter } from "next/navigation";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UploadImage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState("");

  const uploadToClient = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
        initialQuality: 0.8,
        maxWidthOrHeight: 1280,
      };
      const compressedFile = await imageCompression(file, options);
      setPhoto(compressedFile);
      setCreateObjectURL(URL.createObjectURL(file));
    }
  };

  const uploadToServer = async () => {
    if (photo?.name) {
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
      const res = await fetch("/api/postPhoto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postData }),
      });
      res.ok ? router.push("/photoalbum") : setError("投稿に失敗しました");
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-between pb-20">
      <div className="justify-center mt-24">
        <div className="flex justify-between items-center w-full p-5">
          <h1 className="text-left text-2xl">新規投稿</h1>
          <button
            onClick={() => uploadToServer()}
            className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            投稿
          </button>
        </div>
        <div className="text-black">
          {createObjectURL && (
            <img
              className="pt-10 pb-10 pr-5 pl-5 bg-gray-800 justify-center items-center"
              src={createObjectURL}
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
            onChange={uploadToClient}
          />
        </div>
        <div className="flex justify-center items-center w-full p-5">
          {error !== "" && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}
