import { auth } from "@/lib/firebase/client";
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
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { session, sessionLogout } from "./session";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createUser(prevState: any, formData: FormData) {
  const pattern = /^[\u0021-\u007e]+$/u;
  const schema = z
    .object({
      email: z
        .string()
        .email("メールアドレスを入力してください")
        .regex(pattern),
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
    const { email, password } = schema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      passwordConfirm: formData.get("passwordConfirm"),
    } as z.infer<typeof schema>);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    return {
      message: "すでに登録済みのメールアドレスです",
    };
  }
  redirect("/verification");
}

export async function login(prevState: any, formData: FormData) {
  let isEmailVerified = false;

  const pattern = /^[\u0021-\u007e]+$/u;
  const schema = z.object({
    email: z.string().email("メールアドレスを入力してください").regex(pattern),
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
    if (userCredential.user.emailVerified) {
      const id = await userCredential.user.getIdToken();
      await session(id);
      isEmailVerified = true;
    } else {
      alert("メールアドレスを認証してください");
      isEmailVerified = false;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.issues[0].message,
      };
    }
    return {
      message: "パスワードが間違っているか、アカウントが存在しません",
    };
  }
  isEmailVerified ? redirect("/") : redirect("/verification");
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
  } catch (error) {
    return {
      message: "アカウントの削除に失敗しました",
    };
  }
}

export async function sendEmailToResetPassword(
  prevState: any,
  formData: FormData
) {
  const pattern = /^[\u0021-\u007e]+$/u;
  const schema = z.object({
    email: z.string().email("メールアドレスを入力してください").regex(pattern),
  });

  try {
    const { email } = schema.parse({
      email: formData.get("email"),
    } as z.infer<typeof schema>);
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
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
  } catch (error) {
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
    ? redirect("/setnewpassword?modal=true")
    : redirect("/setnewpassword?modal=false");
}
