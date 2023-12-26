import Image from "next/image";
import Link from "next/link";

export default function WatchCardComponent() {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="grid grid-rows-max-content-layout-2 grid-cols-max-content-layout-2 gap-2 p-3">
        <div className="row-start-1 col-start-1 col-end-3 justify-items-center items-center text-center uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          学内ウォッチ
        </div>
        <div className="row-start-2 col-start-1 w-16 h-16">
          <Image
            src="/telescope.png"
            width={100}
            height={100}
            alt="watch"
            priority
          />
        </div>
        <div className="row-start-2 col-start-2">
          <Link href="https://jweb.kyoto-su.ac.jp/webcam/" className="m-0">
            バスプールをアイキャッチ | 学生生活 | 京都産業大学 (kyoto-su.ac.jp)
          </Link>
        </div>
      </div>
    </div>
  );
}
