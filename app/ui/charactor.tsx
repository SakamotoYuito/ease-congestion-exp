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
  const reward = await fetchReward();

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
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            className="text-4xl font-bold"
          >
            {quote}
          </text>
        </svg>
      </div>
      <div className="px-20 flex justify-center items-center">
        <div className="max-w-xs">
          {reward < 30 && (
            <Image
              src="/icon1.png"
              width={400}
              height={400}
              alt="charactor"
              priority
            />
          )}
          {30 <= reward && reward < 60 && (
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
        <label className="text-sm font-bold pr-3">ポイント</label>
        <div className="w-9/12">
          <ProgressBar animated now={reward} max={400} label={`${reward}`} />
        </div>
      </div>
    </div>
  );
}
