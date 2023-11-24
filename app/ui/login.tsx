import { useFormState } from "react-dom";
import SubmitButton from "./submitButton";
import { login } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

export default function LoginComponent() {
  const [error, action] = useFormState(login, initialState);
  const router = useRouter();

  return (
    <div>
      <form action={action}>
        <div>
          <label>Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            required
            minLength={6}
          />
        </div>
        <div>
          <SubmitButton title="ログイン" />
          <p>{error?.message}</p>
        </div>
      </form>
      <div>
        <button onClick={() => router.push("/signup")}>
          新規登録画面はこちら
        </button>
      </div>
    </div>
  );
}
