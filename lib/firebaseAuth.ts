import { useForm, SubmitHandler } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

type FormData = {
  email: string;
  password: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const auth = getAuth();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // サインアップ成功
        console.log("Signed up with:", userCredential.user);
      })
      .catch((error) => {
        // エラー処理
        console.error("Signup error:", error);
      });
  };
}
