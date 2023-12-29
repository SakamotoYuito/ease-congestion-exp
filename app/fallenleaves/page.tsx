import HeaderComponent from "@/app/ui/header";
import FallenLeavesComponent from "../ui/fallenLeaves";
import FooterComponent from "@/app/ui/footer";
import { Suspense } from "react";
import { HeaderSkeleton } from "@/app/ui/skeletons";

export default function PostPhoto() {
  return (
    <main>
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderComponent />
      </Suspense>
      <FallenLeavesComponent />
      <FooterComponent />
    </main>
  );
}
