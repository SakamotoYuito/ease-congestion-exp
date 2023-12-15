"use client";

import { useState, useEffect, useRef } from "react";
import { fetchPhotosInfo } from "@/lib/dbActions";
import { faHeart as blackHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as whiteHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import PhotoDetailsCardComponent from "./photoDetailsCard";

export default function PhotoAlbumComponent() {
  const [photosList, setPhotosList] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState("");

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
  };

  const onClose = () => {
    setSelectedPhoto("");
  };

  useEffect(() => {
    (async () => {
      const photos = await fetchPhotosInfo();
      setPhotosList(photos);
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
      <div className="justify-center mt-24 w-full">
        <h1 className="text-2xl font-bold mb-10 sticky top-24">アルバム</h1>
        <div
          className="grid grid-cols-3 gap-0 p-1 w-full overflow-auto max-h-screen"
          style={{ maxHeight: "calc(100vh - 192px)" }}
        >
          {/* 写真のデータをループして表示する */}
          {photosList.map((photo, index) => (
            <span
              key={photo.id}
              className="border border-gray-300 p-0 z-0"
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="relative overflow-scroll w-full h-0 pb-[100%]">
                <Image
                  src={photo.url}
                  alt={`写真${index + 1}`}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="100%"
                  priority
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div className="mt-1 flex justify-between">
                <p className="p-1 text-xs flex items-center justify-center">
                  {photo.postDate}
                </p>
                <div className="flex items-center justify-center">
                  <button>
                    <FontAwesomeIcon icon={whiteHeart} />
                  </button>
                  <p className="p-1">{photo.fav}</p>
                </div>
              </div>
            </span>
          ))}
          <PhotoDetailsCardComponent
            photo={selectedPhoto}
            onClose={() => onClose()}
          />
        </div>
      </div>
    </main>
  );
}
