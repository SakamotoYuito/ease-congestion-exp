import HeaderComponent from "../ui/header";
import FooterComponent from "../ui/footer";
import { NotificationComponent, NotificationView } from "../ui/notification";

export default function Notification() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
      <HeaderComponent />
      <NotificationView />
      <FooterComponent />
    </main>
  );
}
