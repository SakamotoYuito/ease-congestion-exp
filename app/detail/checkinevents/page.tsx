import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CheckinDetailComponent from "@/app/ui/checkinDetail";
import { Suspense } from "react";
import { HeaderSkeleton, CheckinDetailSkeleton } from "@/app/ui/skeletons";

export default function CheckinEventsDetail() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderComponent />
      </Suspense>
      <Suspense fallback={<CheckinDetailSkeleton />}>
        <CheckinDetailComponent />
      </Suspense>
      <FooterComponent />
    </main>
  );
}
