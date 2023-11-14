"use client";

import { useFormState, useFormStatus } from "react-dom";

export default function Login() {
  return (
    <form>
      <div>
        <h1>ログインしてください</h1>
      </div>
      <div>
        <label>ユーザID</label>
      </div>
      <div>
        <input
          id="id"
          type="email"
          name="id"
          placeholder="IDを入力してください"
          required
        />
      </div>
      <div>
        <button>ログイン</button>
      </div>
    </form>
  );
}
