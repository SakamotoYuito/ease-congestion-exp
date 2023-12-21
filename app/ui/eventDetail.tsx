"use client";

import { useRouter } from "next/navigation";

export default function EventDetailComponent() {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center overflow-auto">
      <button
        onClick={() => router.push("/")}
        className="absolute top-20 right-0 text-lg text-white p-3"
      >
        閉じる
      </button>
    </div>
  );
}
