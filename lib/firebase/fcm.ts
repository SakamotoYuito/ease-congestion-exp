"use client";
import {
  MessagePayload,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";
import { getUserFromCookie } from "../session";
import { app, db } from "./client";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";

export const requestForToken = async (
  isSupported: boolean,
  refresh = false
) => {
  if (!isSupported) {
    return null;
  }
  const messaging = getMessaging();

  let user = await getUserFromCookie();
  if (!user) throw new Error("ログインしてください");
  const uid = user.uid

  const status = await Notification.requestPermission();
  if (!status || status !== "granted") {
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_WEBPUSH_KEY,
  }).catch((err) => {
    debugger;
    console.error("An error occurred while retrieving token. ", err);
    return null;
  });
  if (!token) {
    console.log(
      "No registration token available. Request permission to generate one."
    );
    return null;
  }
  console.log("current token for client: ", token);
  const snapshot = await getDocs(
                            query(
                                collection(db, "notificationToken"), 
                                where("uid", "==", user.uid)
                            )
                        );
  // Tokenが空であれば追加
  if (snapshot.empty) {
    await addDoc(collection(db, "notificationToken"), {
        uid: uid,
        token: token,
    });
  } else {
    // 既にあれば，更新する
    let lastToken = null;
    snapshot.forEach(async (doc) => {
        lastToken = doc.data().token;
        // 登録されているTokenと異なれば更新する．
        if (lastToken !== token) {
            console.log("Update Token")
            await updateDoc(doc.ref, {
                uid: uid,
                token: token,
            })
        }
    })
  }

  return [token, status] as const;
};

export const onMessageListener: (
  isSupported: boolean
) => Promise<MessagePayload | undefined> = async (isSupported: boolean) => {
  if (!isSupported) {
    return;
  }
  const messaging = getMessaging(app);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
};