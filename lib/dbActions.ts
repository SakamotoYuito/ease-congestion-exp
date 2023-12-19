"use server";

import { adminDB } from "@/lib/firebase/server";
import { getUserFromCookie } from "@/lib/session";
import { z } from "zod";

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
      const nickName = userInfoMatchUid.data().settings.nickName;
      const currentDate = new Date();
      const postDate = photoData.date.toDate();

      const setPostDateString = (postDate: Date) => {
        const diffDate = currentDate.getTime() - postDate.getTime();
        if (diffDate < 3600000) {
          return `${Math.floor(diffDate / 60000)}分前`;
        } else if (diffDate < 86400000) {
          return `${Math.floor(diffDate / 3600000)}時間前`;
        } else if (diffDate < 604800000) {
          return `${Math.floor(diffDate / 86400000)}日前`;
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

export async function postCollectionInLogs(
  title: string,
  place: string,
  state: string
) {
  const user = await getUserFromCookie();
  if (!user) throw new Error("ログインしてください");
  const uid = user.uid;
  const logData = {
    title: title,
    place: place,
    state: state,
    date: new Date(),
    uid: uid,
  };
  await adminDB
    .collection("logs")
    .add(logData)
    .catch((error: Error) => {
      throw new Error(error.message);
    });
}

export async function postUserInfo(uid: string, nickName: string) {
  const userInfo = {
    likes: [],
    createdAt: new Date(),
    reward: 0,
    currentPlace: "none",
    notification: {
      isNotify: false,
      id: "",
      createdAt: new Date(),
    },
    settings: {
      nickName: nickName,
      modeOfTransportation: "",
      departureTime: {
        date0110: null,
        date0111: null,
        date0112: null,
      },
    },
  };
  await adminDB
    .collection("users")
    .doc(uid)
    .set(userInfo)
    .catch((error: Error) => {
      throw new Error(error.message);
    });
}

export async function postUserSettings(prevState: any, formData: FormData) {
  const user = await getUserFromCookie();
  if (!user) throw new Error("ログインしてください");
  const uid = user.uid;

  const schema = z.object({
    departureTime0110: z
      .string()
      .min(5, "hh:mm形式で入力してください")
      .max(5, "hh:mm形式で入力してください")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "hh:mm形式で入力してください"),
    departureTime0111: z
      .string()
      .min(5, "hh:mm形式で入力してください")
      .max(5, "hh:mm形式で入力してください")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "hh:mm形式で入力してください"),
    departureTime0112: z
      .string()
      .min(5, "hh:mm形式で入力してください")
      .max(5, "hh:mm形式で入力してください")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "hh:mm形式で入力してください"),
  });

  const { departureTime0110, departureTime0111, departureTime0112 } =
    schema.parse({
      departureTime0110: formData.get("departureTime-10"),
      departureTime0111: formData.get("departureTime-11"),
      departureTime0112: formData.get("departureTime-12"),
    } as z.infer<typeof schema>);

  const dateOfDepartureTime = getDateOfDepartureTime(
    departureTime0110,
    departureTime0111,
    departureTime0112
  );
  const settings = {
    nickName: formData.get("nickName")?.toString() || "",
    modeOfTransportation:
      formData.get("modeOfTransportation")?.toString() || "",
    departureTime: {
      date0110: dateOfDepartureTime[0],
      date0111: dateOfDepartureTime[1],
      date0112: dateOfDepartureTime[2],
    },
  };
  await adminDB
    .collection("users")
    .doc(uid)
    .set({ settings }, { merge: true })
    .catch((error: Error) => {
      return {
        message: "設定の保存に失敗しました",
      };
    });
  return {
    message: "success",
  };
}

export async function fetchUserSettings() {
  const user = await getUserFromCookie();
  if (!user) return null;
  const uid = user.uid;
  const userRef = await adminDB.collection("users").doc(uid).get();
  const settings = userRef.data().settings;
  const departureTime = [
    settings.departureTime.date0110?.toDate(),
    settings.departureTime.date0111?.toDate(),
    settings.departureTime.date0112?.toDate(),
  ];
  if (!departureTime[0] || !departureTime[1] || !departureTime[2]) return null;
  const timeStringList = departureTime.map((time) => {
    const hours = time?.getHours();
    const minutes = time?.getMinutes();
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return timeString;
  });

  const newSettings = settings as any;
  newSettings.departureTime.date0110 = timeStringList[0];
  newSettings.departureTime.date0111 = timeStringList[1];
  newSettings.departureTime.date0112 = timeStringList[2];

  return newSettings;
}

function getDateOfDepartureTime(time1: string, time2: string, time3: string) {
  const departureTime = [time1, time2, time3];
  const dateOfDepartureTime = departureTime.map((time, index) => {
    const day = 10 + index;
    const [hours, minutes] = time.split(":");
    const date = new Date(2024, 0, day);
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date;
  });
  return dateOfDepartureTime;
}

export async function fetchQrInfo(qrId: string) {
  const qrRef = await adminDB.collection("QR").doc(qrId).get();
  const qrInfo = qrRef.data();
  return qrInfo;
}

export async function fetchProgramInfo(programId: string) {
  const programRef = await adminDB.collection("program").doc(programId).get();
  const programInfo = programRef.data();
  return programInfo;
}

export async function patchReward(rewardPoint: string, rewardField?: string) {
  const user = await getUserFromCookie();
  if (!user) return;
  const uid = user.uid;
  try {
    const userRef = await adminDB.collection("users").doc(uid).get();
    const curretReward = userRef.data().reward;
    await adminDB
      .collection("users")
      .doc(uid)
      .set({ reward: curretReward + Number(rewardPoint) }, { merge: true });
  } catch (error) {
    console.log(error);
  }
}

export async function patchCheckinProgramIds(programId: string) {
  const user = await getUserFromCookie();
  if (!user) return;
  const uid = user.uid;
  try {
    console.log("programId", programId);
    const userRef = await adminDB.collection("users").doc(uid).get();
    const checkinProgramIds = userRef.data().checkinProgramIds || [];
    checkinProgramIds.push(programId);
    const newCheckinProgramIds = [...new Set(checkinProgramIds)];
    await adminDB
      .collection("users")
      .doc(uid)
      .set({ checkinProgramIds: newCheckinProgramIds }, { merge: true });
  } catch (error) {
    console.log(error);
  }
}

export async function patchCheckoutProgramIds(programId: string) {
  const user = await getUserFromCookie();
  if (!user) return;
  const uid = user.uid;
  try {
    const userRef = await adminDB.collection("users").doc(uid).get();
    const checkinProgramIds = userRef.data().checkinProgramIds || [];
    const newCheckinProgramIds = checkinProgramIds.filter(
      (id: string) => id !== programId
    );
    await adminDB
      .collection("users")
      .doc(uid)
      .set({ checkinProgramIds: newCheckinProgramIds }, { merge: true });
  } catch (error) {
    console.log(error);
  }
}
