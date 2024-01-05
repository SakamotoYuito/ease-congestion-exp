"use client"
import { fetchNotificationInfo } from "@/lib/dbActions";
import { onMessageListener, requestForToken } from "@/lib/firebase/fcm";
import { isSupported } from "firebase/messaging";
import { useState, useEffect } from "react";
import NotificationDetailsCardComponent from "./notificationDetailsCard";
import { getUserFromCookie } from "@/lib/session";

const checkSupport = async () => {
    const isSupportedThis = await isSupported();
    return isSupportedThis;
};

export function NotificationView() {
    const [notificationList, setNotificationList] = useState<any[]>([]);
    const [selectedNotification, setSelectedNotification] = useState("");

    const handleNotificationClick = (notification: any) => {
        setSelectedNotification(notification);
    };

    const handleOnClose = () => {
        setSelectedNotification("");
    };
    
    useEffect(() => {
        (async () => {
            if (notificationList.length === 0){
                const notifications = await fetchNotificationInfo();
                const uid = (await getUserFromCookie()).uid;
                notifications.forEach((notification) => {
                    if (notification.readUser.includes(uid)){
                        notification.isRead = true;
                    }
                })
                setNotificationList(notifications);
            }
        })();
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center w-full">
        <div className="justify-center mt-24 w-full h-full">
          <div className="text-2xl font-bold mb-20 top-24 w-full">
            <h1 className="text-center">通知</h1>
          </div>
          <div
            className="grid grid-cols-1 gap-5 p-1 w-full overflow-auto mt-20 min-h-full"
            style={{ maxHeight: "calc(100vh - 192px - 4rem)" }} // フッターの高さを考慮して修正
          >
            {/* 通知データをループして表示する */}
            {notificationList.map((notification, index) => (
              <div key={index} className="border border-gray-700 z-0">
                {notification !== "" ? (
                <div
                  className="relative overflow-scroll w-full h-0 pb-[100%] border border-white"
                  onClick={() => handleNotificationClick(notification)}
                >
                    <div className="max-w-sm w-full lg:max-w-full lg:flex">
                      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                        <div className="mb-8">
                          <div className="text-gray-900 font-bold text-xl mb-2">{notification.title}</div>
                          <p className="text-gray-700 text-base">{notification.body}</p>
                          {notification.isRead ? (
                            <div>既読</div>
                          )
                          :(
                            <div>未読</div>
                          )}
                        </div>
                        <div className="flex items-right">
                            <div className="text-sm">
                                <p className="text-gray-600">{notification.postDate}</p>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
                ) : (
                    <div
                      key={index}
                      className="relative overflow-scroll w-full h-0 pb-[100%] bg-gray-200 opacity-70 border border-white"
                    ></div>
                )}
              </div>
            ))}
        </div>
          <NotificationDetailsCardComponent
            notification={selectedNotification}
            onClose={() => handleOnClose()}
          />
        </div>
        </main>
    );
}

export const NotificationComponent = () => {
    const [notification, setNotification] = useState<{
        title: string | undefined;
        body: string | undefined;
    }>({title: "", body: ""});
    
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
    });
    return <div />;
}