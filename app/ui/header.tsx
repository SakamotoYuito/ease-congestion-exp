"use client";

import { useState, useEffect } from "react";
import MenuComponent from "./menu";
import { getUserFromCookie, getIPAddress } from "@/lib/session";
import { useRouter } from "next/navigation";
import { fetchUserSettings } from "@/lib/dbActions";
import Image from "next/image";

export default function HeaderComponent() {
  const router = useRouter();
  const [nickName, setNickName] = useState("");
  const [ipAddress, setIPAddress] = useState<string | null>("");

  useEffect(() => {
    (async () => {
      const user = await getUserFromCookie();
      !user && router.push("/login");
      const userSettings = await fetchUserSettings();
      const nickName = userSettings.nickName;
      setNickName(nickName);
      const ipAddress = await getIPAddress();
      setIPAddress(ipAddress);
    })();
  }, []);

  return (
    <div className="grid grid-cols-3 items-center shadow-md fixed top-0 w-full z-10 bg-white h-20">
      <div className="col-start-2 font-mono text-xl justify-self-center items-center">
        <Image src="/title.png" width={180} height={80} alt="title" />
      </div>
      <div className="col-start-3 font-mono text-sm justify-self-end mr-3">
        <MenuComponent nickName={nickName} />
      </div>
    </div>
  );
}
