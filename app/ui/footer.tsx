"use client";

import {
  faBell,
  faHouseUser,
  faTimeline,
  faImage,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function FooterComponent() {
  const currentPath = usePathname();

  const icons = [faHouseUser, faQrcode, faImage, faTimeline, faBell];
  const title = ["ホーム", "QR", "アルバム", "履歴", "通知"];
  const paths = ["/", "/qrreader", "/photoalbum", "/timeline", "/notification"];

  const selectedIndex = paths.indexOf(currentPath);
  const [selectedIcon, setSelectedIcon] = useState(selectedIndex);

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
              <FontAwesomeIcon
                icon={icon}
                style={{
                  width: "25px",
                  height: "25px",
                  color: selectedIcon === index ? "green" : "black",
                }}
              />
              <div
                className={`text-xs mb-2 ${
                  selectedIcon === index
                    ? "text-green-700 font-bold"
                    : "text-black"
                }`}
              >
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
