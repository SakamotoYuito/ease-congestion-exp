import { auth, postLogEvent } from "@/lib/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  verifyPasswordResetCode,
  confirmPasswordReset,
  getIdToken,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { session, sessionLogout } from "./session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { postUserInfo, postSignature, postCollectionInLogs } from "./dbActions";

const EMAIL_PATTERN = /^[\u0021-\u007e]+@cc\.kyoto-su\.ac\.jp+$/u;

export async function createUser(prevState: any, formData: FormData) {
  const schema = z
    .object({
      sign: z.string().min(1, "署名を入力してください"),
      email: z
        .string()
        .email("大学のメールアドレスを入力してください")
        .regex(EMAIL_PATTERN, "大学のメールアドレスを入力してください"),
      password: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(
          /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          "パスワードは半角英数字混合で入力してください"
        ),
      passwordConfirm: z
        .string()
        .min(8, "確認用のパスワードを入力してください"),
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
      if (password !== passwordConfirm) {
        ctx.addIssue({
          path: ["newPasswordConfirm"],
          code: "custom",
          message: "パスワードが一致しません",
        });
      }
    });

  try {
    const { sign, email, password } = schema.parse({
      sign: formData.get("sign"),
      email: formData.get("email"),
      password: formData.get("password"),
      passwordConfirm: formData.get("passwordConfirm"),
    } as z.infer<typeof schema>);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const id = await getIdToken(userCredential.user, true);
    await session(id);
    await postSignature(sign);
    const uid = auth.currentUser?.uid || "";
    const nickName = email.split("@")[0] + "さん";
    await postUserInfo(uid, nickName);
    await postCollectionInLogs("新規登録", "新規登録", "新規登録成功");
    postLogEvent("認証メール送信成功");
  } catch (error) {
    postLogEvent("新規登録失敗");
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    if (error instanceof FirebaseError) {
      return {
        message: error.message,
      };
    }
    return {
      message: "アカウントの作成に失敗しました",
    };
  }
  redirect("/settings");
}

export async function login(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z
      .string()
      .email("メールアドレスを入力してください")
      .regex(EMAIL_PATTERN, "大学のメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(
        /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
        "パスワードは半角英数字混合で入力してください"
      ),
  });

  try {
    const { email, password } = schema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    } as z.infer<typeof schema>);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const id = await userCredential.user.getIdToken();
    await session(id);
    await postCollectionInLogs("ログイン", "ログイン", "ログイン成功");
    postLogEvent("ログイン成功");
  } catch (error) {
    postLogEvent("ログイン失敗");
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    if (error instanceof FirebaseError) {
      return {
        message: error.message,
      };
    }
    return {
      message: "パスワードが間違っているか、アカウントが存在しません",
    };
  }
  redirect("/settings");
}

export async function logout() {
  try {
    await signOut(auth);
    await sessionLogout();
    postLogEvent("ログアウト成功");
  } catch (error) {
    postLogEvent("ログアウト失敗");
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
    postLogEvent("認証メール再送成功");
  } catch (error) {
    postLogEvent("認証メール再送失敗");
    return {
      message: "認証メールの送信に失敗しました",
    };
  }
  redirect("/verification");
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
    postLogEvent("アカウント削除成功");
  } catch (error) {
    postLogEvent("アカウント削除失敗");
    return {
      message: "アカウントの削除に失敗しました",
    };
  }
}

export async function sendEmailToResetPassword(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    email: z
      .string()
      .email("メールアドレスを入力してください")
      .regex(EMAIL_PATTERN, "大学のメールアドレスを入力してください"),
  });

  try {
    const { email } = schema.parse({
      email: formData.get("email"),
    } as z.infer<typeof schema>);
    await sendPasswordResetEmail(auth, email);
    postLogEvent("パスワードリセットメール送信成功");
  } catch (error) {
    postLogEvent("パスワードリセットメール送信失敗");
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    return {
      message: "メールアドレスが間違っているか、アカウントが存在しません",
    };
  }
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
    postLogEvent("パスワード変更成功");
  } catch (error) {
    postLogEvent("パスワード変更失敗");
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

export async function setNewPassword(prevState: any, formData: FormData) {
  const schema = z
    .object({
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
      oobCode: z.string(),
    })
    .superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
      if (newPassword !== newPasswordConfirm) {
        ctx.addIssue({
          path: ["newPasswordConfirm"],
          code: "custom",
          message: "パスワードが一致しません",
        });
      }
    });

  let isPasswordReset = false;
  try {
    const { newPassword, oobCode } = schema.parse({
      newPassword: formData.get("newPassword"),
      newPasswordConfirm: formData.get("newPasswordConfirm"),
      oobCode: formData.get("oobCode"),
    } as z.infer<typeof schema>);

    await verifyPasswordResetCode(auth, oobCode);
    await confirmPasswordReset(auth, oobCode, newPassword);
    isPasswordReset = true;
    postLogEvent("パスワードリセット成功");
  } catch (error) {
    postLogEvent("パスワードリセット失敗");
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    return {
      message: "パスワードのリセットに失敗しました。",
    };
  }
  isPasswordReset
    ? redirect("/firebaseEmail?modal=true")
    : redirect("/firebaseEmail?modal=false");
}
