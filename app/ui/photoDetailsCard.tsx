import Image from "next/image";
import { faHeart as blackHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as whiteHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { patchUserLikesPhoto, patchPhotoFavNum } from "@/lib/dbActions";
import { postLogEvent } from "@/lib/firebase/client";

export default function PhotoDetailsCardComponent({
  photo,
  likes,
  onSetLikes,
  onClose,
}: {
  photo: any;
  likes: string[];
  onSetLikes: (likes: string[]) => void;
  onClose: () => void;
}) {
  if (photo === "") return null;

  let isError = false;

  const handleLikeClick = async (photoId: string) => {
    let newLikes: string[] = [];
    if (likes.includes(photoId)) {
      // いいねが取り消されたらlikesに入っている該当する画像のidを削除する
      newLikes = likes.filter((id) => id !== photoId);
      onSetLikes(newLikes);
      photo.fav--;
      postLogEvent("いいね取り消し");
    } else {
      // いいねボタンがクリックされたらlikesにその画像のidを追加する
      newLikes = [...likes, photoId];
      onSetLikes(newLikes);
      photo.fav++;
      postLogEvent("いいね");
    }
    const isPatchUsersOk = await patchUserLikesPhoto(newLikes);
    const isPatchPhotosOk = await patchPhotoFavNum(photoId, photo.fav);
    !isPatchUsersOk && !isPatchPhotosOk && (isError = true);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center overflow-auto">
      <button
        onClick={onClose}
        className="absolute top-14 right-3 text-lg text-white p-5 underline"
      >
        閉じる
      </button>
      <div className="absolute top-14 mt-24 pb-20 w-full">
        <Image
          src={photo.url}
          alt={photo.nickName}
          width={300}
          height={300}
          style={{
            width: "90%",
            height: "auto",
            margin: "auto",
          }}
        />
        {isError ? (
          <p className="text-red-500 mt-5">情報の取得に失敗しました</p>
        ) : (
          <div className="mt-1 flex justify-between w-full p-4">
            <div className="text-left">
              <div className="flex items-center">
                {likes.includes(photo.id) ? (
                  <button
                    onClick={() => handleLikeClick(photo.id)}
                    className="flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={blackHeart}
                      style={{
                        width: "20px",
                        height: "20px",
                        paddingRight: "5px",
                        color: "red",
                      }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleLikeClick(photo.id)}
                    className="flex items-center justify-center"
                  >
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
                )}
                <p className="text-xl text-white mb-0">{photo.fav}</p>
              </div>
              <p className="text-white mt-2 mb-0 text-xs">
                {photo.nickName}による投稿
              </p>
              <p className="text-white mb-0 text-xs">{photo.postDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
