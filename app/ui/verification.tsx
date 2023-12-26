import { useRouter } from "next/navigation";
import { reSendEmailVerification, deleteUser } from "@/lib/authentication";
import ModalComponent from "./modal";

export default function VerificationComponent(props: { email: string }) {
  const router = useRouter();
  const info = {
    modalTitle: "メールアドレスの認証",
    mainMessage: `${props.email} へ認証用のメールを送信しました。`,
    subMessage: "メール内のリンクをクリックしてユーザーを有効化してください。",
    leftTitle: "新規登録画面へ戻る",
    rightTitle: "再送する",
    leftOnClick: () => {
      deleteUser();
      router.push("/signup");
    },
    rightOnClick: () => {
      reSendEmailVerification();
    },
  };

  return (
    <div>
      <ModalComponent info={info} />
    </div>
  );
}
