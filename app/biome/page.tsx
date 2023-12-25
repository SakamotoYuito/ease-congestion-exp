import BiomeComponent from "../ui/biome";
import HeaderComponent from "../ui/header";
import FooterComponent from "../ui/footer";

export default function Biome() {
  return (
    <main className="grid grid-rows-base-layout h-screen w-full">
      <HeaderComponent />
      <BiomeComponent />
      <FooterComponent />
    </main>
  );
}
