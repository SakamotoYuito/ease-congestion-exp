import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CharactorComponent from "./ui/charactor";
import AllEventsCardComponent from "./ui/allEventsCard";
import CheckinEventsCardComponent from "./ui/checkinEventsCard";
import WatchCardComponent from "./ui/watchCard";
import { fetchMode, fetchBoardInfo } from "@/lib/dbActions";
import ComingSoonComponent from "./ui/comingSoon";
import { getUserFromCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  HeaderSkeleton,
  CharacterSkeleton,
  CardSkeleton,
} from "./ui/skeletons";
import BoardComponent from "./ui/board";
import QuestionnaireComponent from "./ui/questionnaire";

export default async function Home() {
  const user = await getUserFromCookie();
  user === null && redirect("/login");
  const mode = await fetchMode(user?.uid);
  const boardInfo = await fetchBoardInfo();
  const modalInfo = {
    title: boardInfo?.title || "",
    message: boardInfo?.message || "",
    buttonTitle: boardInfo?.buttonTitle || "",
    link: boardInfo?.link || "",
  };

  return (
    <>
      {(mode?.webMode && mode?.userMode) || !mode?.webMode ? (
        <>
          <main className="grid grid-rows-base-layout min-h-screen w-full pb-40 overflow-auto justify-items-center items-center">
            <Suspense fallback={<HeaderSkeleton />}>
              <HeaderComponent />
            </Suspense>
            <div className="row-start-2 pt-2 ml-2 mr-2">
              <div className="grid grid-rows-max-content-layout-4 grid-cols-2 gap-2 w-full">
                <div className="row-start-1 col-start-1 col-end-3">
                  <Suspense fallback={<CharacterSkeleton />}>
                    <CharactorComponent />
                  </Suspense>
                </div>
                <div className="row-start-2 col-start-1 items-center justify-items-center">
                  <Suspense fallback={<CardSkeleton />}>
                    <AllEventsCardComponent />
                  </Suspense>
                </div>
                <div className="row-start-2 col-start-2 items-center justify-items-center">
                  <Suspense fallback={<CardSkeleton />}>
                    <CheckinEventsCardComponent />
                  </Suspense>
                </div>
                <div className="row-start-3 col-start-1 col-end-3">
                  <WatchCardComponent />
                </div>
                <div className="row-start-4 col-start-1 col-end-2">
                  <QuestionnaireComponent
                    link="https://docs.google.com/forms/d/1h0VJ0yfx5Sw5Ks0ftVfy3aZjaDNbTPi3HPFdfrwkCu4/viewform?edit_requested=true"
                    title="アンケート①"
                  />
                </div>
                <div className="row-start-4 col-start-2 col-end-3">
                  <QuestionnaireComponent
                    link="https://docs.google.com/forms/d/1Uf7H2nsNujnZYsq2_HuytNph2C0Bv_BaHWB9UxB14xg/viewform?ts=659b50bc&edit_requested=true"
                    title="アンケート②"
                  />
                </div>
              </div>
            </div>
            <FooterComponent />
          </main>
          {boardInfo !== null && <BoardComponent info={modalInfo} />}
        </>
      ) : (
        <ComingSoonComponent />
      )}
    </>
  );
}
