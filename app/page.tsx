import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";
import CharactorComponent from "./ui/charactor";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-24 p-2 pb-20">
      <HeaderComponent />
      {/* <h1 className="text-4xl font-bold text-center mb-10">Coming soon...</h1> */}
      <CharactorComponent />
      <FooterComponent />
    </main>
  );
}
