import HeaderComponent from "../ui/header";
import QrReaderComponent from "../ui/qrReader";
import FooterComponent from "../ui/footer";

export default function QrReader() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen pb-20">
      <HeaderComponent />
      <QrReaderComponent />
      <FooterComponent />
    </main>
  );
}
