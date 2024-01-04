importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 通知を受けとると push イベントが呼び出される。
self.addEventListener(
  "push",
  function (event) {
    let message = event.data.json();
    console.log("event:push", message);
    let messageTitle = message.notification.title;
    let messageBody = message.notification.body;
    let tag = "cuppa";

    const notificationPromise = self.registration.showNotification(
      messageTitle,
      {
        icon: "/img/icons/favicon-32x32.png",
        body: messageBody,
        tag: tag,
      }
    );

    event.waitUntil(notificationPromise);
  },
  false
);

// WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
messaging.setBackgroundMessageHandler(function (payload) {
  console.log("backgroundMessage");

  return self.registration.showNotification(payload.title, {
    body: payload.body,
  });
});
