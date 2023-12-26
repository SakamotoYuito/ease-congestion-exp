import Image from "next/image";
import { fetchReward } from "@/lib/dbActions";
import ProgressBar from "react-bootstrap/ProgressBar";

export default async function CharactorComponent() {
  const handleCharactorClick = () => {
    const quoteList = ["おはよ", "寒いね", "お腹すいた"];
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  };

  const quote = handleCharactorClick();
  const { currentReward, prevReward } = await fetchReward();

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
          <rect width="305" height="127" rx="10" fill="#ffffff" />
          <path
            d="M69.118 138.921L55.0857 124.844L82.7964 124.5L69.118 138.921Z"
            fill="#ffffff"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            className="text-4xl font-bold"
          >
            {quote}
          </text>
        </svg>
      </div>
      <div className="px-20 flex justify-center items-center">
        <div className="max-w-xs">
          {currentReward < 30 && (
            <Image
              src="/icon1.png"
              width={400}
              height={400}
              alt="charactor"
              priority
            />
          )}
          {30 <= currentReward && currentReward < 60 && (
            <Image
              src="/icon2.png"
              width={400}
              height={400}
              alt="charactor"
              priority
            />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center p-2 w-full">
        <div className="w-9/12">
          <ProgressBar variant="success" now={currentReward} max={400} />
        </div>
      </div>
      <div className="grid grid-rows-2 grid-cols-2 justify-items-center items-center p-2 bg-white rounded-xl shadow-md">
        <div className="row-start-1 col-start-1 text-sm">合計獲得ポイント</div>
        <div className="row-start-2 col-start-1 text-xl font-bold">
          {currentReward}pt
        </div>
        <div className="row-start-1 col-start-2 text-sm">直近獲得ポイント</div>
        <div className="row-start-2 col-start-2 text-lg font-bold pl-3">
          {currentReward - prevReward > 0 ? (
            <span className="text-red-500">
              +{currentReward - prevReward}pt
            </span>
          ) : (
            <span className="text-black">±0pt</span>
          )}
        </div>
      </div>
    </div>
  );
}
