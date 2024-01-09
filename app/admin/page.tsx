"use client"

import { fetchNotificationInfo, getBiomeCollection, getLeavesCollection, getNotificationToken, getPlace, getUsers } from "@/lib/dbActions";
import { db } from "@/lib/firebase/client";
import { getUserFromCookie } from "@/lib/session";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    (async () => {
        const user = await getUserFromCookie();
        const uid = user.uid;
        if (!uid) return;

        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setIsAdmin(data.dev);
        }
    })();
    }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
        {isAdmin ? (
            <div className="justify-center mt-24 w-full h-full">
            <div className="text-2xl font-bold top-24 w-full">
                <h1 className="text-center">管理画面</h1>
            </div>
            <div className="grid grid-cols-3 h-full p-5 gap-3">
                <div className="grid grid-rows-2 gap-3 h-full">
                    <CameraStatusView />
                    <UserListView />
                </div>
                <div className="grid grid-rows-2 gap-3 h-full">
                    <NotifyView />
                    <div className="grid grid-rows-3 gap-2 h-full">
                        <BiomeCSVExportView />
                        <FallenLeavesView />
                        <BiomeUsersNameView />
                    </div>
                </div>
                <NotificationView />
            </div>
        </div>
        ) : (
            <></>
        )}


    </main>
  );
}

export function BiomeUsersNameView() {
    const [usersList, setUsersList] = useState<any[]>([]);

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const now = new Date();

        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');

        const datestring = `${year}${month}${day}_${hour}${minute}${second}`

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', datestring+"_"+filename);
        link.click();
    }

    const setUsersString = () => {
        if (!usersList) return "";
        
        // date, place, uid, reward, fullPath, url
        const header = "uid, biomeUserName\n"
        const rows = usersList.map((user) => {
            return `${user.uid}, ${user.biomeUserName}`
        }).join("\n");

        if (!rows)
            return "";
        return header + rows;
    }

    useEffect(() => {
        const usersCollectionRef = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = () => onSnapshot(usersCollectionRef, (snapshot) => {
            const users = snapshot.docs.map((user: any) => {
                const uid = user.id;
                const biomeName = user.data().biomeUserName? user.data().biomeUserName : "";
                
                const checkinProgramIds = user.data().checkinProgramIds;
                const reward = user.data().reward;
                const settings = user.data().settings
                const modeOfTransportation = settings.modeOfTransportation;
                const nickName = settings.nickName;
                const university = user.data().university;
          
                return {
                  uid: uid,
                  biomeUserName: biomeName,
                  checkinProgramIds: checkinProgramIds,
                  reward: reward,
                  modeOfTransportation: modeOfTransportation,
                  nickName: nickName,
                  university: university,
                };
            });
            setUsersList(users);
        });
        return () => {
            unsubscribe();
        }
    
    }, []);

    useEffect(() => {
        (async () => {
            const users = await getUsers();
            setUsersList(users);
        })();
    }, []);

    return (
        <div className="bg-red-200 rounded">
            <p className="mt-1 text-xl font-bold">Biome User Name CSV 出力</p>
            <div>
                <div className="grid grid-cols-1 m-10">
                    <button 
                    onClick={() => {
                        downloadCSV(setUsersString(), 'biomeUserNames.csv');
                    }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Download
                    </button>
                </div>
            </div>
            <a ref={anchorRef} className="hidden"></a>
        </div>
    )
}

export function FallenLeavesView() {
    const [leavesList, setLeavesList] = useState<any[]>([]);
    const [lastUpdateTime, setLastUpdateTime] = useState("");
    
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const now = new Date();

        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');

        const datestring = `${year}${month}${day}_${hour}${minute}${second}`

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', datestring+"_"+filename);
        link.click();
    }

    const setLeavesString = () => {
        if (!leavesList) return "";
        
        // date, place, uid, reward, fullPath, url
        const header = "date, place, uid, reward, fullPath, url\n"
        const rows = leavesList.map((leave) => {
            return `${leave.date}, ${leave.place}, ${leave.uid}, ${leave.reward}, ${leave.fullPath}, ${leave.url}`
        }).join("\n");

        if (!rows)
            return "";
        return header + rows;
    }

    useEffect(() => {
        const leavesCollectionRef = query(collection(db, "fallenLeaves"), orderBy("date", "desc"));
        const unsubscribe = () => onSnapshot(leavesCollectionRef, (snapshot) => {
            const leaves = snapshot.docs.map((leave) => {
                const data = leave.data();
                const date = data.date.toDate();
                const fullPath = data.fullPath;
                const place = data.place;
                const reward = data.reward;
                const uid = data.uid;
                const url = data.url;

                const year = date.getFullYear().toString().padStart(4, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hour = date.getHours().toString().padStart(2, '0');
                const minute = date.getMinutes().toString().padStart(2, '0');
                const second = date.getSeconds().toString().padStart(2, '0');

                const datestring = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
                
                return {
                  date: datestring,
                  fullPath: fullPath,
                  place: place,
                  reward: reward,
                  uid: uid,
                  url: url,
                };
            });
            if (leaves) setLastUpdateTime(leaves[0].date);
            return leaves;
        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        (async () => {
            const leaves = await getLeavesCollection();
            if (leaves) setLastUpdateTime(leaves[0].date);
            setLeavesList(leaves);
        })();
    }, []);

    return (
        <div className="bg-red-200 rounded">
            <p className="mt-1 text-xl font-bold">fallenLeaves CSV 出力</p>
            <div>
                <div className="grid grid-cols-1 m-10">
                    <button 
                    onClick={() => {
                        downloadCSV(setLeavesString(), 'leaves.csv');
                    }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Download
                    </button>
                    <div className="text-right mt-3">
                        最終更新: {lastUpdateTime}
                    </div>
                </div>
            </div>
            <a ref={anchorRef} className="hidden"></a>
        </div>
    )
}

export function BiomeCSVExportView() {
    const [biomeList, setBiomeList] = useState<any[]>([]);
    const [lastUpdateTime, setLastUpdateTime] = useState("");

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const now = new Date();

        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');

        const datestring = `${year}${month}${day}_${hour}${minute}${second}`

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', datestring+"_"+filename);
        link.click();
    }
    const setBiomeString = () => {
        if (!biomeList) return "";
        // CSV出力処理
        // date, name, uid, reward, fullPath, url, note
        const header = "date, name, uid, reward, fullPath, url, note\n"
        const rows = biomeList.map((biome) => {
            return `${biome.date}, ${biome.name}, ${biome.uid}, ${biome.reward}, ${biome.fullPath}, ${biome.url}, ${biome.note}`
        }).join("\n");

        if (!rows)
            return "";
        return header + rows;
    }

    useEffect(() => {
        const biomeCollectionRef = query(collection(db, "biome"), orderBy("date", "desc"));
        const unsubscribe = () => onSnapshot(biomeCollectionRef, (snapshot) => {
            const biomes = snapshot.docs.map((biome) => {
                const data = biome.data();
                const date = data.date.toDate();

                const year = date.getFullYear().toString().padStart(4, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hour = date.getHours().toString().padStart(2, '0');
                const minute = date.getMinutes().toString().padStart(2, '0');
                const second = date.getSeconds().toString().padStart(2, '0');
        
                const datestring = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`        

                return {
                  date: datestring,
                  fullPath: data.fullPath,
                  name: data.name,
                  note: data.note,
                  reward: data.reward,
                  uid: data.uid,
                  url: data.url,
                }
            });
            if (biomes) setLastUpdateTime(biomes[0].date);
            setBiomeList(biomes);  
        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        (async () => {
          const biomes = await getBiomeCollection();
          if (biomes) setLastUpdateTime(biomes[0].date);
          setBiomeList(biomes);
        })();
    }, []);

    return (
        <div className="bg-red-200 rounded">
            <p className="mt-1 text-xl font-bold">Biome CSV 出力</p>
            <div>
                <div className="grid grid-cols-1 m-10">
                    <button 
                    onClick={() => {
                        downloadCSV(setBiomeString(), `biome.csv`);
                    }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Download
                    </button>
                    <div className="text-right mt-3">
                        最終更新: {lastUpdateTime}
                    </div>
                </div>
            </div>
            <a ref={anchorRef} className="hidden"></a>
        </div>
    )
}

export function CameraStatusView() {
    const [placeList, setPlaceList] = useState<any[]>([]);

    useEffect(() => {
        const placeCollectionRef = query(collection(db, "place"));
        const unsubscribe = () => onSnapshot(placeCollectionRef, (snapshot) => {
            const places = snapshot.docs.map((place:any) => {
                const data = place.data();
                const center = data.center;
                const congestion = data.congestion;
                const id = data.id;
                const name = data.name;
                const updatedAt = data.updatedAt
                if (updatedAt === undefined)
                  return;

                const currentDate = new Date();

                const setPostDateString = (postDate: Date) => {
                const diffDate = currentDate.getTime() - postDate.getTime();
                if (diffDate < 3600000) {
                    return `${Math.floor(diffDate / 60000)}分前`;
                } else if (diffDate < 86400000) {
                    return `${Math.floor(diffDate / 3600000)}時間前`;
                } else if (diffDate < 604800000) {
                    return `${Math.floor(diffDate / 86400000)}日前`;
                }
                return `${postDate.getFullYear()}年${postDate.getMonth()}月${postDate.getDate()}日`;
                };
                const dateString = setPostDateString(updatedAt.toDate());
        
                return {
                    congestion: congestion,
                    id: id,
                    name: name,
                    updatedAt: dateString,
                };   
            });
            
            const result = places.filter((place) => place !== undefined);
            setPlaceList(result);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        (async () => {
            const places = await getPlace();
            setPlaceList(places);
        })();
    }, [])

    return (
        <div className="bg-blue-200 rounded">
            <p className="mt-1 text-xl font-bold">カメラ一覧</p>
            <div className="grid grid-cols-3">
                {placeList.map((place, index) => (
                    <div key={index} className="z-0">
                        {place !== undefined ? (
                            <div className="relative w-full p-[3%]">
                                <div className="w-full lg:max-w-full">
                                    <div className="bg-white rounded lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                        <div className="text-gray-900 font-bold text-xl text-left w-full">
                                            {place.id}
                                        </div>
                                        <p className="text-gray-700 text-base text-left">{place.name}: {place.congestion}人</p>
                                        <div className="flex items-right">
                                            <div className="flex text-sm">
                                                <p className="text-gray-600">最終更新: {place.updatedAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function UserListView() {
    const [userList, setUserList] = useState<any[]>([]);
    const [tokenList, setTokenList] = useState<any[]>([]);

    const transpotationMethod = (method: string) => {
        switch (method) {
            case "kitaooji":
                return "北大路バスターミナル行き"
            case "kokusai":
                return "国際会館駅行き"
            case "demachi":
                return "出町柳駅行き"
            case "niken":
                return "二軒茶屋シャトル"
            case "kamigamo":
                return "上賀茂シャトル"
            case "walk":
                return "徒歩"
            case "bicycle":
                return "自転車"
            case "bike":
                return "バイク"
            case "other":
                return "その他"
            default:
                return "未設定"
        }
    }

    useEffect(() => {
        (async () => {
            const users = await getUsers();
            // const tokens = await getNotificationToken();
            setUserList(users);
            // setTokenList(tokens);
        })();
    }, []);

    return (
        <div className="bg-green-200 rounded p-1">
            <p className="mt-1 text-xl font-bold">ユーザリスト</p>
            <div
            className="grid grid-cols-1 w-full min-h-[93%] overflow-scroll"
            style={{ maxHeight: "calc(100vh - 1000px - 4rem)" }} // フッターの高さを考慮して修正
            >
            {/* 通知データをループして表示する */}
            {userList.map((user, index) => (
              <div key={index} className="z-0">
                {user !== "" ? (
                <div
                  className="relative w-full p-[3%]"
                >
                    <div className="w-full lg:max-w-full">
                      <div className="bg-white rounded lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                        <div className="w-full">
                          <div className="grid grid-cols-2">
                            <div className="text-gray-900 font-bold text-xl text-left">{user.nickName}</div>
                            <div className={`text-right ${user.university? "text-red-600":""}`}>{user.university? "在学中":""}</div>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="mt-2 mb-0 text-gray-700 text-xl text-left">ポイント: {user.reward} pt</p>
                            <p className="text-right text-gray-400">交通手段: {transpotationMethod(user.modeOfTransportation)}</p>
                          </div>
                          <p className="mt-2 text-gray-700 text-sm text-left">チェックインプログラム: {user.checkinProgramIds.toString()}</p>
                        </div>
                        <div className="flex text-sm">
                            <p className="text-gray-400">{user.uid}</p>
                        </div>
                        <p className="text-right text-green-700">{tokenList.includes(user.uid)? "通知可能" : ""}</p>
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
    )
}

export function NotifyView() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const onNotify = async () => {
        const result = confirm("通知を送信しますか？");
        if (!result) return;

        const message = {
            title: title,
            body: body,
            pushUser: [],
            readUser: [],
            createdAt: serverTimestamp(),
        }

        const query = collection(db, "notificationInfo");
        await addDoc(query, message);
    }

    const onChangeTitleText = (event: React.ChangeEvent<HTMLInputElement>): void => setTitle(event.target.value);
    const onChangeBodyText = (event: React.ChangeEvent<HTMLInputElement>): void => setBody(event.target.value);


    return (
        <div className="bg-orange-200 rounded">
            <p className="mt-1 text-xl font-bold">通知画面</p>

            <div className="grid grid row-3 p-5">
                <div className="mb-2">
                    <label htmlFor="title" className="flex text-right">タイトル</label>
                    <input
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Title"
                      type={"text"}
                      value={title}
                      onChange={onChangeTitleText}
                    />
                </div>
                <div className="mb-2">
                <label htmlFor="message" className="flex text-right">通知メッセージ</label>
                <input 
                      id="message"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Message"
                      type={"text"}
                      value={body}
                      onChange={onChangeBodyText}
                    />
                </div>
                <button 
                    className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => onNotify()}
                >
                    送信
                </button>
            </div>

        </div>
    )
}


export function NotificationView() {
    const [notificationList, setNotificationList] = useState<any[]>([]);
    const [changeNotificationList, setChangeNotificationList] = useState(false);
    
    useEffect(() => {
        const notificationInfoCollectionRef = query(collection(db, "notificationInfo"), orderBy("createdAt", "desc"));
        const unsubscribe = () => onSnapshot(notificationInfoCollectionRef, (snapshot) => {
            const notifications = snapshot.docs.map((notification) => {
                const id = notification.id;
                const title = notification.data().title;
                const body = notification.data().body;
                const readUser = notification.data().readUser;
                const pushUser = notification.data().pushUser ? notification.data().pushUser : [];

                // serverTimestampを使ってデータを追加した瞬間はnullになる可能性があるため，推定時刻を仮置きで入れる
                const createdAt = notification.data({ serverTimestamps: "estimate" }).createdAt.toDate();
                const currentDate = new Date();
          
                const setPostDateString = (postDate: Date) => {
                  const diffDate = currentDate.getTime() - postDate.getTime();
                  if (diffDate < 3600000) {
                    return `${Math.floor(diffDate / 60000)}分前`;
                  } else if (diffDate < 86400000) {
                    return `${Math.floor(diffDate / 3600000)}時間前`;
                  } else if (diffDate < 604800000) {
                    return `${Math.floor(diffDate / 86400000)}日前`;
                  }
                  return `${postDate.getFullYear()}年${postDate.getMonth()}月${postDate.getDate()}日`;
                };

                const postDateString = setPostDateString(createdAt);
          
                return {
                  id: id,
                  title: title,
                  body: body,
                  postDate: postDateString,
                  isRead: false,
                  readUser: readUser,
                  pushUser: pushUser,
                };
            });
            setNotificationList(notifications);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        (async () => {
          const notifications = await fetchNotificationInfo();
          setNotificationList(notifications);
        })();
    }, []);

    return (
        <div className="bg-orange-200 rounded">
            <p className="mt-1 text-xl font-bold">通知一覧</p>
          <div
            className="grid grid-cols-1 w-full min-h-[98%] overflow-scroll"
            style={{ maxHeight: "calc(100vh - 1000px - 4rem)" }} // フッターの高さを考慮して修正
            >
            {/* 通知データをループして表示する */}
            {notificationList.map((notification, index) => (
              <div key={index} className="z-0">
                {notification !== "" ? (
                <div
                  className="relative w-full p-[3%]"
                >
                    <div className="w-full lg:max-w-full">
                      <div className="bg-white rounded lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                        <div className="w-full">
                          <div className="text-gray-900 font-bold text-xl text-left w-full">{notification.title}</div>
                          <p className="text-gray-700 text-base text-left">{notification.body}</p>
                        </div>
                        <div className="flex items-right">
                            <div className="flex text-sm">
                                <p className="text-gray-600">{notification.postDate}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="text-center text-base">
                                通知ユーザ: {notification.pushUser.length===0 ? "全員" :  notification.pushUser.length}
                            </div>
                            <div className="text-center text-base">
                                既読ユーザ: {notification.readUser.length}
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
    );
}