"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { postUserSettings } from "@/lib/dbActions";
import { useRouter } from "next/navigation";
import { postCollectionInLogs, fetchUserSettings } from "@/lib/dbActions";
import type { UserSettings } from "@/lib/type";

const initialState = {
  message: "",
};

export default function SettingsComponent() {
  const [error, action] = useFormState(postUserSettings, initialState);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [selected, setSelected] = useState("");
  const [canNotification, setCanNotification] = useState(true);
  const router = useRouter();

  const options = [
    { value: "walk", label: "徒歩" },
    { value: "bicycle", label: "自転車" },
    { value: "bike", label: "バイク" },
    { value: "kamigamo", label: "上賀茂シャトル" },
    { value: "niken", label: "二軒茶屋シャトル" },
    { value: "kokusai", label: "国際会館駅行き" },
    { value: "kitaooji", label: "北大路バスターミナル行き" },
    { value: "demachi", label: "出町柳駅行き" },
    { value: "other", label: "その他" },
  ];

  useEffect(() => {
    (async () => {
      const userSettings = await fetchUserSettings();
      setSettings(userSettings);
      if (userSettings !== null) {
        setSelected(userSettings.modeOfTransportation);
      }
    })();
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    if (error.message === "success") {
      (async () => {
        await postCollectionInLogs("設定完了", "設定完了", "設定");
      })();
      router.push("/");
    }
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">設定</h1>
      <form action={action} className="w-full max-w-xs space-y-4">
        <div className="flex flex-row justify-between items-center">
          <label htmlFor="notification" className="mr-2 text-lg font-bold">
            プッシュ通知許可:
          </label>
          <input
            id="notification"
            type="hidden"
            value={canNotification ? "true" : "false"}
            name="notification"
          />
          {canNotification ? (
            <span
              className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-700"
              onClick={() => setCanNotification(false)}
            >
              許可しています
            </span>
          ) : (
            <span
              className="bg-white px-4 py-2 text-black rounded hover:bg-gray-400"
              onClick={() => setCanNotification(true)}
            >
              許可していません
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="nickName" className="mb-2 text-lg font-bold">
            ニックネーム:
          </label>
          <div className="relative inline-block w-full">
            <input
              id="nickName"
              type="text"
              name="nickName"
              placeholder="ニックネームを入力"
              required
              defaultValue={settings?.nickName}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="modeOfTransportation"
            className="mb-2 text-lg font-bold"
          >
            通学手段(大学から帰る時に使う手段):
          </label>
          <div className="relative inline-block w-full">
            <select
              id="modeOfTransportation"
              name="modeOfTransportation"
              className="block w-full px-2 py-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-50"
              value={selected}
              onChange={handleSelectChange}
            >
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="departureTime-10" className="mb-2 text-lg font-bold">
            1/10(水) 大学から帰る時間:
            <br />
            例: 18:00
          </label>
          <div className="relative inline-block w-full">
            <input
              id="departureTime-10"
              type="time"
              name="departureTime-10"
              required
              defaultValue={
                settings?.departureTime.date0110
                  ? settings?.departureTime.date0110
                  : undefined
              }
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="departureTime-11" className="mb-2 text-lg font-bold">
            1/11(木) 大学から帰る時間:
            <br />
            例: 18:00
          </label>
          <div className="relative inline-block w-full">
            <input
              id="departureTime-11"
              type="time"
              name="departureTime-11"
              required
              defaultValue={
                settings?.departureTime.date0111
                  ? settings?.departureTime.date0111
                  : undefined
              }
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="departureTime-12" className="mb-2 text-lg font-bold">
            1/12(金) 大学から帰る時間:
            <br />
            例: 18:00
          </label>
          <div className="relative inline-block w-full">
            <input
              id="departureTime-12"
              type="time"
              name="departureTime-12"
              required
              defaultValue={
                settings?.departureTime.date0112
                  ? settings?.departureTime.date0112
                  : undefined
              }
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            完了
          </button>
        </div>
        <p className="text-red-500 text-center">{error?.message}</p>
      </form>
    </main>
  );
}
