import Image from "next/image";
import { faHeart as blackHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as whiteHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PhotoDetailsCardComponent({
  photo,
  onClose,
}: {
  photo: any;
  onClose: () => void;
}) {
  if (!photo) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center overflow-auto">
      <button
        onClick={onClose}
        className="absolute top-14 right-3 text-lg text-white p-5"
      >
        閉じる
      </button>
      <div className="absolute mt-24 pb-20">
        <Image
          src={photo.url}
          alt={photo.nickName}
          width={300}
          height={300}
          style={{
            width: "auto",
            height: "auto",
          }}
        />
        <div className="mt-1 flex justify-between w-full p-5">
          <div className="text-left">
            <p className="text-white">{photo.postDate}</p>
            <p className="text-white">{photo.nickName}による投稿</p>
          </div>
          <div className="flex items-center">
            <button>
              <FontAwesomeIcon
                icon={whiteHeart}
                style={{
                  width: "20px",
                  height: "20px",
                  paddingRight: "5px",
                  color: "white",
                }}
              />
            </button>
            <p className="text-xl text-white">{photo.fav}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
