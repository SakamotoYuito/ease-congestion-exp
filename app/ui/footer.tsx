"use client";

import {
  faBell,
  faHouseUser,
  faTimeline,
  faImage,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NotificationComponent } from "./notification";
import { getUserFromCookie } from "@/lib/session";
import { fetchNotificationInfo } from "@/lib/dbActions";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function FooterComponent() {
  const currentPath = usePathname();

  const icons = [faHouseUser, faQrcode, faImage, faTimeline, faBell];
  const title = ["ホーム", "QR", "アルバム", "履歴", "通知"];
  const paths = ["/", "/qrreader", "/photoalbum", "/timeline", "/notification"];

  const selectedIndex = paths.indexOf(currentPath);
  const [selectedIcon, setSelectedIcon] = useState(selectedIndex);

  const [notificationUpdateFlag, setNotificationUpdateFlag] = useState(true);
  const [isReadAllNotification, setIsReadAllNotification] = useState(true);

  const checkReadAllNotification = async (uid: string) => {
    const notifications = await fetchNotificationInfo();
    notifications.forEach((notification: any) => {
      // 未読の通知が存在すればfalseに設定
      if (!notification.readUser.includes(uid)) {
        setIsReadAllNotification(false);
      }
    });
  }

  useEffect(() => {
    const notificationInfoCollectionRef = query(collection(db, "notificationInfo"));
    const unsubscribe = () => onSnapshot(notificationInfoCollectionRef, (querySnapshot) => {
      setNotificationUpdateFlag(true);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getUserFromCookie();
      if (!user) return;
      const uid = user.uid;
      if (notificationUpdateFlag) {
        await checkReadAllNotification(uid);
        setNotificationUpdateFlag(false);
      }
    })();
  }, [notificationUpdateFlag]);

  return (
    <div className="fixed bottom-0 w-full border-t border-gray-300 z-10 bg-[#f5ffec] h-20">
      <div className="flex justify-around pt-2 pb-3 mx-4">
        {icons.map((icon, index) => (
          <Link href={paths[index]} key={index}>
            <button
              key={index}
              onClick={() => {
                setSelectedIcon(index);
              }}
            >
            {icon===faBell ? (
              < >
                {isReadAllNotification ? (
                  <FontAwesomeIcon
                    icon={icon}
                    style={{
                      width: "25px",
                      height: "25px",
                      color: selectedIcon === index ? "green" : "black",
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={icon}
                    style={{
                      width: "25px",
                      height: "25px",
                      color: selectedIcon === index ? "green" : "red",
                    }}
                  />
                )}
              </>
            ):(
                <FontAwesomeIcon
                  icon={icon}
                  style={{
                    width: "25px",
                    height: "25px",
                    color: selectedIcon === index ? "green" : "black",
                  }}
                />
            )}
            <div className={`text-xs mb-2 ${selectedIcon === index ? "text-green-700 font-bold" : "text-black"}`}>
              {title[index]}
            </div>
            </button>
          </Link>
        ))}
      </div>
      <NotificationComponent />
    </div>
  );
}
