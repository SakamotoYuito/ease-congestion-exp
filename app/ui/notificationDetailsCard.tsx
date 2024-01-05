import { patchNotificationReadUser } from "@/lib/dbActions";
import { getUserFromCookie } from "@/lib/session";
import { useEffect, useState } from "react";


export default function NotificationDetailsCardComponent({
    notification,
    onClose,
}: {
    notification: any;
    onClose: () => void;
}) {
    useEffect(() => {
        (async () => {
            if (notification === "") return null;
            // DBの既読更新処理
            const userInfo = await getUserFromCookie();
            console.log(userInfo.uid);

            // readUserにuidが含まれている場合は何もしない
            if (notification.readUser.includes(userInfo.uid)) {
                // skip
                console.log("既読");
            } else {
                // DB更新
                let _ = await patchNotificationReadUser(notification.id);
            }
        })();
    })

    if (notification === "") return null;
    let isError = false;
    
    notification.isRead = true;

    return (
      <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-14 right-3 text-lg text-white p-5"
        >
          閉じる
        </button>
        <div className="absolute top-14 mt-24 pb-20 w-full">

        </div>
      </div>
    );
}