import MenuComponent from "./menu";
import { getUserFromCookie, getIPAddress } from "@/lib/session";
import { redirect } from "next/navigation";
import { fetchUserSettings } from "@/lib/dbActions";
import Image from "next/image";

export default async function HeaderComponent() {
  const user = await getUserFromCookie();
  !user && redirect("/login");
  const userSettings = await fetchUserSettings();
  const nickName = userSettings.nickName;
  const ipAddress = await getIPAddress();

  return (
    <div className="grid grid-cols-3 items-center shadow-md fixed top-0 w-full z-10 bg-white h-20">
      <div className="col-start-2 font-mono text-xl justify-self-center">
        <Image src="/title.jpg" width={160} height={65} alt="title" />
      </div>
      <div className="col-start-3 font-mono text-sm justify-self-end mr-3">
        <MenuComponent nickName={nickName} />
      </div>
    </div>
  );
}
