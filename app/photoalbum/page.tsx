import PhotoAlbumComponent from "../ui/photoAlbum";
import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import { Suspense } from "react";
import { HeaderSkeleton } from "@/app/ui/skeletons";

export default function PhotoAlbum() {
  return (
    <main>
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderComponent />
      </Suspense>
      <PhotoAlbumComponent />
      <FooterComponent />
    </main>
  );
}
