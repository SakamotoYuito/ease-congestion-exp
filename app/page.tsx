import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CharactorComponent from "./ui/charactor";
import AllEventsComponent from "./ui/allEventsCard";
import CheckinEventsCardComponent from "./ui/checkinEventsCard";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center mt-24 p-2">
      <HeaderComponent />
      {/* <h1 className="text-4xl font-bold text-center mb-10">Coming soon...</h1> */}
      <CharactorComponent />
      <div className="flex items-center justify-center w-full mt-3">
        <AllEventsComponent />
        <div className="w-4"></div>
        <CheckinEventsCardComponent />
      </div>
      <FooterComponent />
    </main>
  );
}
