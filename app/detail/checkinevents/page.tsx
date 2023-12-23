import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import EventDetailComponent from "@/app/ui/eventDetail";

export default function CheckinEventsDetail() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <HeaderComponent />
      <EventDetailComponent />
      <FooterComponent />
    </main>
  );
}
