import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CharactorComponent from "./ui/charactor";
import AllEventsComponent from "./ui/allEventsCard";
import CheckinEventsCardComponent from "./ui/checkinEventsCard";

export default function Home() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <HeaderComponent />
      {/* <h1 className="text-4xl font-bold text-center mb-10">Coming soon...</h1> */}
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
  );
}
