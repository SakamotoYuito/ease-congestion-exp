"use server";

import { adminDB } from "@/lib/firebase/server";
import { getUserFromCookie } from "@/lib/session";

export async function fetchPhotosInfo() {
  const photosCollection = await adminDB
    .collection("photos")
    .orderBy("date", "desc")
    .get();
  const photosPathList = await Promise.all(
    photosCollection.docs.map(async (photo: any) => {
      const id = photo.id;
      const photoData = photo.data();
      const userInfoMatchUid = await adminDB
        .collection("users")
        .doc(photoData.uid)
        .get();
      const nickName = userInfoMatchUid.data().nickName;
      const currentDate = new Date();
      const postDate = photoData.date.toDate();

      const setPostDateString = (postDate: Date) => {
        const diffDate = currentDate.getTime() - postDate.getTime();
        if (diffDate < 86400000) {
          return `${Math.floor(
            (currentDate.getTime() - postDate.getTime()) / 3600000
          )}時間前`;
        } else if (diffDate < 604800000) {
          return `${Math.floor(
            (currentDate.getTime() - postDate.getTime()) / 86400000
          )}日前`;
        }
        return `${postDate.getFullYear()}年${postDate.getMonth()}月${postDate.getDate()}日`;
      };

      const postDateString = setPostDateString(postDate);

      return {
        id: id,
        nickName: nickName,
        fav: photoData.fav,
        url: photoData.url,
        place: photoData.place,
        postDate: postDateString,
      };
    })
  );
  return photosPathList;
}

export async function fetchLikesPhoto() {
  const user = await getUserFromCookie();
  if (!user) return null;
  const uid = user.uid;
  const userRef = await adminDB.collection("users").doc(uid).get();
  const likes = userRef.data().likes;
  return likes;
}

export async function patchUserLikesPhoto(likes: string[]) {
  const user = await getUserFromCookie();
  if (!user) return false;
  const uid = user.uid;
  await adminDB
    .collection("users")
    .doc(uid)
    .set({ likes: likes }, { merge: true })
    .catch((error: Error) => {
      return false;
    });
  return true;
}

export async function patchPhotoFavNum(photoId: string, newFavNum: number) {
  try {
    await adminDB.collection("photos").doc(photoId).update({ fav: newFavNum });
    return true;
  } catch (error) {
    return false;
  }
}
