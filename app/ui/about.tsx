import { redirect } from "next/navigation";
import Link from "next/link";

export default function AboutComponent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen pb-20 px-3">
      <h2 className="text-2xl font-bold">概要</h2>
      <p className="text-lg">
        このアプリケーションは、京都産業大学の学内混雑解消と自然環境の活用・保全を目的としています。
      </p>
      <h2 className="text-2xl font-bold mt-3">イベント運営</h2>
      <p className="text-lg">京都産業大学 生命科学部 西田研究室</p>
      <h2 className="text-2xl font-bold mt-3">アプリケーション開発</h2>
      <p className="text-lg">京都産業大学 情報理工学部 棟方研究室</p>
      <h2 className="text-2xl font-bold mt-3">お問い合わせ</h2>
      <p className="text-lg">-----@----com</p>
      <Link href={"/"} className="no-underline text-white mt-4">
        <p className="text-lg bg-blue-500 p-2 rounded-md">ホームに戻る</p>
      </Link>
    </main>
  );
}
