import { fetchCheckinProgramIds } from "@/lib/dbActions";
import Link from "next/link";

export default async function CheckinEventsCardComponent() {
  const checkinProgramIds = await fetchCheckinProgramIds();

  const text = checkinProgramIds.length !== 0 ? "イベントあり" : "イベントなし";
  const isContentExist = checkinProgramIds.length !== 0 ? true : false;
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex justify-center text-center">
        <div className="p-3">
          <div className="uppercase tracking-wide text-sm text-green-700 font-semibold">
            参加中のイベント
          </div>
          <p className="mt-2 text-black">{text}</p>
          {isContentExist ? (
            <Link href="/detail/checkinevents">
              <button className="mt-2 px-4 py-1 text-white font-semibold bg-green-700 rounded inline-block">
                詳細
              </button>
            </Link>
          ) : (
            <button
              aria-disabled
              className="mt-2 px-4 py-1 text-white font-semibold bg-gray-500 rounded inline-block"
            >
              詳細
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
