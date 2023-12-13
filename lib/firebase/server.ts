const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { getStorage } = require("firebase-admin/storage");

function createFirebaseApp() {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
      ),
      storageBucket: "ksu-solve-congestion.appspot.com",
    });
  } else {
    return admin.app();
  }
}

const app = createFirebaseApp();
export const adminDB = getFirestore(app);
export const auth = getAuth(app);
export const bucket = getStorage(app);
