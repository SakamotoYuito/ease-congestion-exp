import { initializeApp, getApps, getApp, FirebaseError } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { session, sessionLogout } from "../session";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

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

export let analytics: Analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics();
  }
});

export async function createUser(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
  } catch (error) {
    return {
      message: "すでに登録済みかパスワードが間違っています",
    };
  }
  return redirect("/verification");
}

export async function login(prevState: any, formData: FormData) {
  noStore();
  let isEmailVerified = false;
  try {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user.emailVerified) {
      const id = await userCredential.user.getIdToken();
      await session(id);
      isEmailVerified = true;
    } else {
      alert("メールアドレスを認証してください");
      isEmailVerified = false;
    }
  } catch (error) {
    return {
      message: "パスワードが間違っているか、アカウントが存在しません",
    };
  }
  return isEmailVerified ? redirect("/") : redirect("/verification");
}

export async function logout() {
  try {
    await signOut(auth);
    await sessionLogout();
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        message: error.message,
      };
    }
  }
}

export async function reSendEmailVerification() {
  try {
    const userCredential = auth.currentUser;
    if (userCredential) {
      await sendEmailVerification(userCredential);
      alert("認証メールを再送しました");
    } else {
      alert("ログインしていません");
    }
  } catch (error) {
    return {
      message: "認証メールの送信に失敗しました",
    };
  }
  return redirect("/verification");
}

export async function deleteUser() {
  try {
    const userCredential = auth.currentUser;
    if (userCredential) {
      await userCredential.delete();
      redirect("/signup");
    } else {
      alert("ログインしていません");
    }
  } catch (error) {
    return {
      message: "アカウントの削除に失敗しました",
    };
  }
}

export async function resetPassword(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email")?.toString() || "";
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    return {
      message: "メールアドレスが間違っているか、アカウントが存在しません",
    };
  }
  return;
}

export async function changePassword(prevState: any, formData: FormData) {
  let isPasswordChanged = false;
  const currentUser = auth.currentUser;
  if (!currentUser) redirect("/login");
  const schema = z
    .object({
      oldPassword: z.string().min(1, "パスワードを入力してください"),
      newPassword: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(
          /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          "パスワードは半角英数字混合で入力してください"
        ),
      newPasswordConfirm: z
        .string()
        .min(8, "確認用のパスワードを入力してください"),
    })
    .superRefine(({ oldPassword, newPassword, newPasswordConfirm }, ctx) => {
      if (newPassword !== newPasswordConfirm) {
        ctx.addIssue({
          path: ["newPasswordConfirm"],
          code: "custom",
          message: "パスワードが一致しません",
        });
      }
      if (oldPassword === newPassword) {
        ctx.addIssue({
          path: ["newPassword"],
          code: "custom",
          message: "現在のパスワードと同じです",
        });
      }
    });

  try {
    const { oldPassword, newPassword } = schema.parse({
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      newPasswordConfirm: formData.get("newPasswordConfirm"),
    } as z.infer<typeof schema>);

    const credential = EmailAuthProvider.credential(
      currentUser.email || "",
      oldPassword
    );
    const userCredential = await reauthenticateWithCredential(
      currentUser,
      credential
    );
    await updatePassword(userCredential.user, newPassword);
    isPasswordChanged = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    return {
      message:
        "パスワードの変更に失敗しました。現在のパスワードが間違っている可能性があります。",
    };
  }
  isPasswordChanged
    ? redirect("/changepassword?modal=true")
    : redirect("/changepassword?modal=false");
}
