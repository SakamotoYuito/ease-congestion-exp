import ProgressBar from "react-bootstrap/ProgressBar";

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin h-10 w-10 border-t-4 border-b-4 border-green-600 rounded-full"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl`}
    >
      <div className="md:flex justify-center text-center border-spacing-3">
        <div className="p-3">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            ローディング...
          </div>
          <p className="mt-2 text-gray-500">データを取得中...</p>
          <span className="mt-2 px-4 py-1 text-white font-semibold bg-gray-500 rounded inline-block">
            詳細
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex justify-between shadow-md fixed top-0 w-full z-10 bg-[#b8e986] h-20">
      <div className="p-4 font-mono text-xl">
        <h1>Enre</h1>
      </div>
      <div className="p-4 font-mono text-sm space-y-2">
        <div className="text-lg"></div>
      </div>
    </div>
  );
}

export function CharacterSkeleton() {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <svg
          width="305"
          height="140"
          viewBox="0 0 305 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7/12 h-auto max-h-14 pl-20"
        >
          <rect width="305" height="127" rx="10" fill="#348DE0" />
          <path
            d="M69.118 138.921L55.0857 124.844L82.7964 124.5L69.118 138.921Z"
            fill="#348DE0"
          />
        </svg>
      </div>
      <div className="px-20 flex justify-center items-center">
        <div className="max-w-xs h-40">
          <LoadingAnimation />
        </div>
      </div>
      <div className="flex justify-center items-center p-2 w-full">
        <div className="w-9/12">
          <ProgressBar animated now={0} max={400} label={0} />
        </div>
      </div>
      <div className="grid grid-rows-2 grid-cols-2 justify-items-center items-center p-2 bg-white rounded-xl shadow-md">
        <div className="row-start-1 col-start-1 text-sm">合計獲得ポイント</div>
        <div className="row-start-2 col-start-1 text-xl font-bold">--pt</div>
        <div className="row-start-1 col-start-2 text-sm">直近獲得ポイント</div>
        <div className="row-start-2 col-start-2 text-lg font-bold pl-3">
          <span className="text-black">--pt</span>
        </div>
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="grid row-start-2 h-hull overflow-auto w-full px-5 justify-center">
      <div className="flex justify-center">
        <LoadingAnimation />
      </div>
    </div>
  );
}

export function CheckinDetailSkeleton() {
  return (
    <div className="grid row-start-2 h-hull overflow-auto w-full px-5 justify-center">
      <div className="mt-5">
        <h1 className="text-xl font-bold text-center mb-10">
          チェックイン中のイベント
        </h1>
        <p className="text-right">件</p>
        <div className="flex justify-center">
          <LoadingAnimation />
        </div>
      </div>
    </div>
  );
}
