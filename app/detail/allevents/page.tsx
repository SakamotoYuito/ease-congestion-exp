import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import EventDetailComponent from "@/app/ui/eventDetail";
import { Suspense } from "react";
import { HeaderSkeleton, EventDetailSkeleton } from "@/app/ui/skeletons";

export default function AllEventsDetail() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderComponent />
      </Suspense>
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventDetailComponent />
      </Suspense>
      <FooterComponent />
    </main>
  );
}
