import PhotoAlbumComponent from "../ui/photoAlbum";
import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";

export default function PhotoAlbum() {
  return (
    <main>
      <HeaderComponent />
      <PhotoAlbumComponent />
      <FooterComponent />
    </main>
  );
}
