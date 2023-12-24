import Link from "next/link";
import { fetchAllOnlinePrograms } from "@/lib/dbActions";

export default async function AllEventsCardComponent() {
  const allOnlinePrograms = await fetchAllOnlinePrograms();
  const text = allOnlinePrograms.length !== 0 ? "イベントあり" : "イベントなし";
  const isContentExist = allOnlinePrograms.length !== 0 ? true : false;
  return (
    <div className="w-full mx-1 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-2">
      <div className="md:flex justify-center text-center border-spacing-3">
        <div className="p-3">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            イベント一覧
          </div>
          <p className="mt-2 text-gray-500">{text}</p>
          {isContentExist ? (
            <Link href="/detail/allevents">
              <span className="mt-2 px-4 py-1 text-white font-semibold bg-blue-500 rounded inline-block">
                詳細
              </span>
            </Link>
          ) : (
            <span className="mt-2 px-4 py-1 text-white font-semibold bg-gray-500 rounded inline-block">
              詳細
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
