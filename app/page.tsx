import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CharactorComponent from "./ui/charactor";
import AllEventsComponent from "./ui/allEventsCard";
import CheckinEventsCardComponent from "./ui/checkinEventsCard";
import { fetchMode } from "@/lib/dbActions";
import ComingSoonComponent from "./ui/comingSoon";
import { getUserFromCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserFromCookie();
  user === null && redirect("/login");
  const mode = await fetchMode(user?.uid);

  return (
    <>
      {(mode?.webMode && mode?.userMode) || !mode?.webMode ? (
        <main className="grid grid-rows-base-layout h-screen w-full">
          <HeaderComponent />
          <div className="row-start-2 pt-2">
            <CharactorComponent />
            <div className="flex items-center justify-center w-full mt-3">
              <AllEventsComponent />
              <div className="w-4"></div>
              <CheckinEventsCardComponent />
            </div>
          </div>
          <FooterComponent />
        </main>
      ) : (
        <ComingSoonComponent />
      )}
    </>
  );
}
