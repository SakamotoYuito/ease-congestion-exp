"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useFormState } from "react-dom";
import { postUserSettings } from "@/lib/dbActions";
import { useRouter } from "next/navigation";
import { postCollectionInLogs, fetchUserSettings } from "@/lib/dbActions";
import type { UserSettings } from "@/lib/type";
import TimeTableComponent from "./timeTable";

const initialState = {
  message: "",
};

const initialTimeTable: { [key: number]: boolean[] } = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => [i, Array(3).fill(false)])
);

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
        setSelectedCells(userSettings.timeTable);
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

  const days = [10, 11, 12];
  const periods = ["1限", "2限", "昼休", "3限", "4限", "5限"];
  const [selectedCells, setSelectedCells] = useState(initialTimeTable);

  const toggleCell = (periodIndex: number, dayIndex: number) => {
    setSelectedCells((prev) => {
      const newCells = JSON.parse(JSON.stringify(prev)); // オブジェクトを新しく作成
      const row = newCells[periodIndex]; // 特定のキーに対応する配列を取得
      row[dayIndex] = !row[dayIndex]; // 選択された要素を逆にする
      return newCells;
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">設定</h1>
      <form action={action} className="w-full max-w-xs space-y-4">
        <div className="flex flex-row justify-between items-center">
          <label htmlFor="notification" className="mr-2 text-lg font-bold">
            プッシュ通知:
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
        <TimeTableComponent
          days={days}
          periods={periods}
          selectedCells={selectedCells}
          onCellToggle={toggleCell}
        />
        <input
          id="timeTable"
          type="hidden"
          value={JSON.stringify(selectedCells)}
          name="timeTable"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            保存
          </button>
        </div>
        <p className="text-red-500 text-center">{error?.message}</p>
      </form>
    </main>
  );
}
