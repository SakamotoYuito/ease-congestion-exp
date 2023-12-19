import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 pb-20">
      <HeaderComponent />
      <h1 className="text-4xl font-bold text-center mb-10">Comming soon...</h1>
      <FooterComponent />
    </main>
  );
}
