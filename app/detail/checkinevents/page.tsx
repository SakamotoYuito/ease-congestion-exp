import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CheckinDetailComponent from "@/app/ui/checkinDetail";

export default function CheckinEventsDetail() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <HeaderComponent />
      <CheckinDetailComponent />
      <FooterComponent />
    </main>
  );
}
