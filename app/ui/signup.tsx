import { useFormState } from "react-dom";
import SubmitButton from "./submitButton";
import { createUser } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

export default function SignUpComponent() {
  const router = useRouter();
  const [error, action] = useFormState(createUser, initialState);

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
          <SubmitButton title="新規登録" />
          <p>{error?.message}</p>
        </div>
      </form>
      <div>
        <button onClick={() => router.push("/login")}>
          登録済みの方はこちら
        </button>
      </div>
    </div>
  );
}
