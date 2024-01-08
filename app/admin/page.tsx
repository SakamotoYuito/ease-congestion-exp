"use client"

import { fetchNotificationInfo, getBiomeCollection, getLeavesCollection, getPlace, getUsers } from "@/lib/dbActions";
import { adminDB } from "@/lib/firebase/server";
import { getUserFromCookie } from "@/lib/session";
import { arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
        <div className="justify-center mt-24 w-full h-full">
            <div className="text-2xl font-bold top-24 w-full">
                <h1 className="text-center">管理画面</h1>
            </div>
            <div className="grid grid-cols-3 h-full p-5">
                <div className="grid grid-rows-2 h-full">
                    <NotifyView />
                    <UserListView />
                </div>
                <div className="grid grid-rows-2 h-full">
                    <CameraStatusView />
                    <div className="grid grid-rows-3 h-full">
                        <BiomeCSVExportView />
                        <FallenLeavesView />
                        <BiomeUsersNameView />
                    </div>
                </div>
                <NotificationView />
            </div>
        </div>
    </main>
  );
}

export function BiomeUsersNameView() {
    const [usersList, setUsersList] = useState<any[]>([]);

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
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
        (async () => {
            const users = await getUsers();
            setUsersList(users);
        })();
    }, []);

    return (
        <div className="border border-black">
            <p>Biome User Name CSV 出力</p>
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

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.click();
    }

    const setLeavesString = () => {
        if (!leavesList) return "";
        
        // date, place, uid, reward, fullPath, url
        const header = "date, time, place, uid, reward, fullPath, url\n"
        const rows = leavesList.map((leave) => {
            return `${leave.date}, ${leave.place}, ${leave.uid}, ${leave.reward}, ${leave.fullPath}, ${leave.url}`
        }).join("\n");

        if (!rows)
            return "";
        return header + rows;
    }

    useEffect(() => {
        (async () => {
            const leaves = await getLeavesCollection();
            setLeavesList(leaves);
        })();
    }, []);

    return (
        <div className="border border-black">
            <p>fallenLeaves CSV 出力</p>
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
                </div>
            </div>
            <a ref={anchorRef} className="hidden"></a>
        </div>
    )
}

export function BiomeCSVExportView() {
    const [biomeList, setBiomeList] = useState<any[]>([]);

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const downloadCSV = (csv: string, filename: string) => {
        const link = anchorRef.current
        if (!link) return;

        const bom = new Uint8Array([0xef, 0xbb, 0xbf])
        const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.click();
    }
    const setBiomeString = () => {
        if (!biomeList) return "";
        // CSV出力処理
        // date, name, uid, reward, fullPath, url, note
        const header = "date, time, name, uid, reward, fullPath, url, note\n"
        const rows = biomeList.map((biome) => {
            return `${biome.date}, ${biome.name}, ${biome.uid}, ${biome.fullPath}, ${biome.url}, ${biome.note}`
        }).join("\n");

        if (!rows)
            return "";
        return header + rows;
    }
    useEffect(() => {
        (async () => {
          const biomes = await getBiomeCollection();
          setBiomeList(biomes);
        })();
    }, []);

    return (
        <div className="border border-black">
            <p>Biome CSV 出力</p>
            <div>
                <div className="grid grid-cols-1 m-10">
                    <button 
                    onClick={() => {
                        downloadCSV(setBiomeString(), 'biome.csv');
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

export function CameraStatusView() {
    const [placeList, setPlaceList] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const places = await getPlace();
            setPlaceList(places);
        })();
    }, [])

    return (
        <div className="border border-black">
            <p>カメラ一覧</p>
            <div className="grid grid-cols-3">
                {placeList.map((place, index) => (
                    <div key={index} className="z-0">
                        {place !== "" ? (
                            <div className="relative w-full p-[3%]">
                                <div className="w-full lg:max-w-full lg:flex">
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
            setUserList(users);
        })();
    }, []);

    return (
        <div className="border border-black">
            <p>ユーザリスト</p>
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
    return (
        <div className="border border-black">
            <p>通知画面</p>
        </div>
    )
}


export function NotificationView() {
    const [notificationList, setNotificationList] = useState<any[]>([]);
    const [changeNotificationList, setChangeNotificationList] = useState(false);
    
    useEffect(() => {
        (async () => {
          const notifications = await fetchNotificationInfo();
          setNotificationList(notifications);
        })();
    }, []);

    return (
        <div>
            <p>通知一覧</p>
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
                    <div className="w-full lg:max-w-full lg:flex">
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