import HeaderComponent from "@/app/ui/header";
import FooterComponent from "@/app/ui/footer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HeaderComponent />
      <FooterComponent />
    </main>
  );
}
