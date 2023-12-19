import { initializeApp, getApps, getApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { logEvent } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
};

function createFirebaseApp(firebaseConfig: object) {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

export const app = createFirebaseApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);

export let analytics: Analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics();
  }
});

export function postLogEvent(title: string, options?: object) {
  logEvent(analytics, title, options);
}

export async function requestNotificationPermission(uid: string) {
  // const firestore = getFirestore(app);
  // const messaging = getMessaging(app);

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_WEBPUSH_KEY,
    });

    if (token) {
      console.log(`Notification token: ${token}`);
      await setDoc(doc(db, "users", uid), { token: token }, { merge: true });
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
}
