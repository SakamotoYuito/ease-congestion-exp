"use client";

import {
  faBell,
  faHouseUser,
  faTimeline,
  faImage,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function FooterComponent() {
  const router = useRouter();
  const currentPath = usePathname();

  const icons = [faHouseUser, faCamera, faImage, faTimeline, faBell];
  const paths = ["/", "/qrreader", "/upload", "/timeline", "/notification"];

  const selectedIndex = paths.indexOf(currentPath);
  const [selectedIcon, setSelectedIcon] = useState(selectedIndex);

  return (
    <div className="fixed bottom-0 w-full border-t border-gray-300">
      <div className="flex justify-around p-4">
        {icons.map((icon, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedIcon(index);
              router.push(paths[index]);
            }}
          >
            <FontAwesomeIcon
              icon={icon}
              style={{
                width: "30px",
                height: "30px",
                color: selectedIcon === index ? "green" : "black",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
