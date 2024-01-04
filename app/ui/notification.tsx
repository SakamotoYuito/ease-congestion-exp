"use client"
import { onMessageListener, requestForToken } from "@/lib/firebase/fcm";
import { isSupported } from "firebase/messaging";
import { useState, useEffect } from "react";

const checkSupport = async () => {
    const isSupportedThis = await isSupported();
    return isSupportedThis;
};

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