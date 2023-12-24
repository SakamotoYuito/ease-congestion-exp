import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center text-center w-full h-full">
        <h1 className="text-5xl font-bold text-green-500">404</h1>
        <h2 className="pb-10">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">ホームに戻る</Link>
      </div>
    </div>
  );
}
