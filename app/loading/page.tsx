import LoadingComponent from "../ui/loading";
import HeaderComponent from "../ui/header";
import FooterComponent from "../ui/footer";

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen pb-20">
      <HeaderComponent />
      <LoadingComponent />
      <FooterComponent />
    </main>
  );
}
