import HeaderComponent from "../../ui/header";
import FooterComponent from "../../ui/footer";
import PostBiomeComponent from "../../ui/postBiome";

export default function PostBiome() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <HeaderComponent />
      <PostBiomeComponent />
      <FooterComponent />
    </main>
  );
}
