"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function SignUpComponent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // サインアップ成功
        console.log("Signed up with:", userCredential.user);
        router.push("/test");
      })
      .catch((error) => {
        // エラー処理
        console.error("Signup error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email:</label>
        <input {...register("email", { required: true })} />
        {errors.email && <span>This field is required</span>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}
      </div>
      <div>
        <button type="submit">Sign Up</button>
      </div>
    </form>
  );
}
