const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");
const firestore = require("firebase-admin/firestore");

function createFirebaseApp() {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
      ),
    });
  } else {
    return admin.app();
  }
}

const app = createFirebaseApp();
export const adminDB = firestore.getFirestore(app);
