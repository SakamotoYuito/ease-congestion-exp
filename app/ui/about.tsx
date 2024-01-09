import Link from "next/link";

export default function AboutComponent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-3">
      <h2 className="text-2xl font-bold">Enreとは?</h2>
      <p className="text-lg text-center font-bold text-green-700 mb-0">
        京都産業大学は、とても広いです。
      </p>
      <p className="text-lg">
        きっと学内には、未だ行ったことのない施設や、自然環境、コミュニティが沢山あります…
      </p>
      <p className="text-lg">
        普段の空いた時間や混雑時間を活用して、大学にある多様な出会いと様々な活動経験により、
        もっと
        <span className="font-bold no-underline text-green-700">
          有意義な時間
        </span>
        を創りたい！と考えました。そんな目標を目指して、
        学内で行われている様々なイベント、社会・環境活動を共有するWebアプリ「
        <span className="font-bold no-underline text-green-700">
          Enre（ver1.1.0）
        </span>
        」をつくりました… 」を使って新しい発見で毎日にゆとりと出会いを!
      </p>
      <p className="text-lg">
        「
        <span className="font-bold no-underline text-green-700">
          Enre（エンリー）
        </span>
        」を使って、毎日に新たな出会いと経験を！
      </p>
      <h2 className="text-2xl font-bold mt-5">Enre（ver. 1.1.0）の概要</h2>
      <p className="text-lg">
        Enre（ver1.1.0）は、2024年1月10日〜12日に開催される
        <span className="font-bold no-underline text-green-700">
          学内のイベント・社会環境活動 （プレイベント）を案内します
        </span>
        （Enreの利用は31日まで）。Enreに登録すると、 自身のイベント・活動の
        <span className="font-bold no-underline text-green-700">
          経験や貢献が、Enre上でポイントとして把握できます。
        </span>
        ポイントが貯まると、カエルのアイコン（がまちゃん）が成長します。
      </p>
      <p className="text-lg">
        Enre（ver1.1.0）は、 試行版ですが、今回のプレイベントを踏まえて、
        Enreは、大学や他の地域において、イベント・環境活動への参加を促すツールとして開発を進めたいです。
      </p>
      <p className="text-lg">
        皆さんの意見や参加をもとに、改良を重ねたいと思いますので、ぜひご協力ください。
      </p>
      <h2 className="text-2xl font-bold mt-5">企画・制作</h2>
      <p className="text-lg">
        本取組は、グリーンインフラの社会実装に向けた研究活動として、以下の２つの研究室が協働しておこなっています。
      </p>
      <ul className="text-lg">
        <li className="before:content-['・'] ml-4 -indent-4">
          京都産業大学 生命科学部 産業生命科学科 西田研究室
        </li>
        <li className="before:content-['・'] ml-4 -indent-4">
          京都産業大学 情報理工学部 情報理工学科 棟方研究室
        </li>
      </ul>
      <p className="text-sm">
        なお、本取組は、内閣府SIPスマートインフラマネジメントシステムの構築e-1「魅力的な国土・都市・地域づくりを評価するグリーンインフラに関する省庁連携基盤」の研究活動の一環です。
      </p>
      <h2 className="text-2xl font-bold mt-5">お問い合わせ先</h2>
      <p className="text-lg">nisidalab@gmail.com</p>
      <Link href={"/"} className="no-underline text-white mt-4">
        <button className="text-lg bg-green-700 p-2 rounded-md">
          ホームに戻る
        </button>
      </Link>
    </main>
  );
}
