import Link from "next/link";
import Image from "next/image";

export default function QuestionnaireComponent() {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="grid grid-rows-max-content-layout-2 grid-cols-max-content-layout-2 gap-2 p-3">
        <div className="row-start-1 col-start-1 col-end-3 justify-items-center items-center text-center uppercase tracking-wide text-sm text-green-700 font-semibold">
          アンケート
        </div>
        <div className="row-start-2 col-start-1 w-10 h-10">
          <Image
            src="/questionnaire.png"
            width={80}
            height={80}
            alt="questionnaire"
            priority
          />
        </div>
        <div className="row-start-2 col-start-2">
          <Link
            href="https://docs.google.com/forms/d/1h0VJ0yfx5Sw5Ks0ftVfy3aZjaDNbTPi3HPFdfrwkCu4/"
            target="_blank"
            className="m-0 text-blue-600 underline"
          >
            アンケートにご協力ください
          </Link>
        </div>
      </div>
    </div>
  );
}
