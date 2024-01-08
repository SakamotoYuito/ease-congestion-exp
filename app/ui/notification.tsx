"use client";
import { fetchNotificationInfo } from "@/lib/dbActions";
import { onMessageListener, requestForToken } from "@/lib/firebase/fcm";
import { isSupported } from "firebase/messaging";
import { useState, useEffect } from "react";
import { getUserFromCookie } from "@/lib/session";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function NotificationView() {
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState("");
  const [changeNotificationList, setChangeNotificationList] = useState(false);

  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification);

    if (notification === "") return null;

    // UIの更新処理
    const index = notificationList.findIndex((not) => {
      return notification.id === not.id;
    });
    // 検索に引っかからなければリターン
    if (index < 0) {
      return;
    }
    notificationList[index].isRead = true;
    setNotificationList(notificationList);
    setChangeNotificationList(!changeNotificationList);

    // DBの既読更新処理
    const userInfo = await getUserFromCookie();

    // readUserにuidが含まれている場合は何もしない
    if (notification.readUser.includes(userInfo.uid)) {
      // skip
      console.log("既読");
    } else {
      // DB更新
      const user = await getUserFromCookie();
      if (!user) return false;
      const uid = user.uid;

      const notificationRef = await doc(
        db,
        "notificationInfo",
        notification.id
      );

      await updateDoc(notificationRef, {
        readUser: arrayUnion(uid),
      });
    }
  };

  const handleOnClose = () => {
    setSelectedNotification("");
  };

  useEffect(() => {
    (async () => {
      const notifications = await fetchNotificationInfo();
      const uid = (await getUserFromCookie()).uid;
      const pushedNotifications = notifications.filter((notification) => {
        if (notification.pushUser.length === 0) {
          // 特定のユーザが指定されていなければ通知対象
          return true;
        }
        if (notification.pushUser.includes(uid)) {
          // 通知対象に入っていれば通知
          return true;
        }
        // それ以外は通知対象外
        return false;
      });
      pushedNotifications.forEach((notification: any) => {
        if (notification.readUser.includes(uid)) {
          notification.isRead = true;
        }
      });
      setNotificationList(pushedNotifications);
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center w-full">
      <div className="justify-center mt-24 w-full h-full">
        <div className="text-2xl font-bold mb-20 top-24 w-full">
          <h1 className="text-center">通知</h1>
        </div>
        <div
          className="grid grid-cols-1 w-full overflow-scroll mt-20 min-h-[74%]"
          style={{ maxHeight: "calc(100vh - 1000px - 4rem)" }} // フッターの高さを考慮して修正
        >
          {/* 通知データをループして表示する */}
          {notificationList.map((notification, index) => (
            <div key={index} className="z-0">
              {notification !== "" ? (
                <div
                  className="relative w-full px-3 py-1"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="w-full lg:max-w-full lg:flex">
                    <div
                      className={`lg:border-l-0 lg:border-t lg:border-gray-400 ${
                        notification.isRead ? "bg-gray-400" : "bg-white"
                      } rounded lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal`}
                    >
                      <div className="w-full">
                        <div className="text-gray-900 font-bold text-xl text-left w-full">
                          {notification.title}
                        </div>
                        <p className="text-gray-700 text-base text-left">
                          {notification.body}
                        </p>
                      </div>
                      <div className="flex items-right">
                        <div className="flex text-sm">
                          <p className="text-gray-600">
                            {notification.postDate}
                          </p>
                          {notification.isRead ? (
                            <p className="pl-2">既読</p>
                          ) : (
                            <p className="pl-2">未読</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative overflow-scroll w-full h-0 pb-[100%] bg-gray-200 opacity-70"
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const checkSupport = async () => {
  const isSupportedThis = await isSupported();
  return isSupportedThis;
};

export const NotificationComponent = () => {
  const [notification, setNotification] = useState<{
    title: string | undefined;
    body: string | undefined;
  }>({ title: "", body: "" });

  const [isSupportedMessage, setIsSupportedMessage] = useState<Boolean>(false);
  useEffect(() => {
    checkSupport().then((isSupportedThis) => {
      setIsSupportedMessage(isSupportedThis);
    });
    requestForToken(Boolean(isSupportedMessage));
    onMessageListener(Boolean(isSupportedMessage))
      .then((payload) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      })
      .catch((err) => console.log("failed: ", err));
  }, [isSupportedMessage]);
  return <div></div>;
};
