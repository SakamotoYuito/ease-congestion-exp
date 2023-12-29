import HeaderComponent from "@/app/ui/header";
import WalkComponent from "../ui/walk";
import FooterComponent from "@/app/ui/footer";
import { Suspense } from "react";
import { HeaderSkeleton } from "@/app/ui/skeletons";

export default function Walk() {
  return (
    <main>
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderComponent />
      </Suspense>
      <WalkComponent />
      <FooterComponent />
    </main>
  );
}
