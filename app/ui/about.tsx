import Link from "next/link";

export default function AboutComponent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-3">
      <h2 className="text-2xl font-bold">Enreとは?</h2>
      <p className="text-lg">
        学内の自然環境や一部のエリアは賑わいに欠けている…​
      </p>
      <p className="text-lg">
        待ち時間や混雑を避けて自然や今まで行ったことのないエリアで過ごし、キャンパスライフを充実させ、
        <span className="font-bold text-green-700 no-underline">
          有意義な時間
        </span>
        を届けたい！そんな気持ちで作ったのがこのアプリです…​
      </p>
      <p className="text-lg">
        Webアプリ「
        <span className="font-bold no-underline text-green-700">
          Enre（エンリー）
        </span>
        」を使って新しい発見で毎日にゆとりと出会いを!
      </p>
      <h2 className="text-2xl font-bold mt-3">制作</h2>
      <p className="text-lg">
        京都産業大学 生命科学部 産業生命科学科 西田研究室
      </p>
      <p className="text-lg">
        京都産業大学 情報理工学部 情報理工学科 棟方研究室
      </p>
      <h2 className="text-2xl font-bold mt-3">お問い合わせ先</h2>
      <p className="text-lg">nisidalab@gmail.com</p>
      <Link href={"/"} className="no-underline text-white mt-4">
        <button className="text-lg bg-green-700 p-2 rounded-md">
          ホームに戻る
        </button>
      </Link>
    </main>
  );
}
