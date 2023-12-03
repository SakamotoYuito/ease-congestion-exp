import { useRouter } from "next/navigation";
import { reSendEmailVerification, deleteUser } from "@/lib/authentication";

export default function VerificationComponent(props: { email: string }) {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-4 bg-white rounded shadow-xl">
          <h2 className="text-2xl font-bold mb-4">メールアドレスの認証</h2>
          <p className="mb-4">{props.email} へ認証用のメールを送信しました。</p>
          <p className="mb-4">
            メール内のリンクをクリックしてユーザーを有効化してください。
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                deleteUser();
                router.push("/signup");
              }}
              className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
            >
              ログイン画面へ戻る
            </button>
            <button
              onClick={reSendEmailVerification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              再送する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
