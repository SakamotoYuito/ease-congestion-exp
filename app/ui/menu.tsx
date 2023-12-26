"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/authentication";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function MenuComponent({ nickName }: { nickName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative inline-block text-left z-20" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        type="button"
        className="flex flex-col z-10 space-y-2 text-center items-center"
      >
        Menu
        <div className="w-8 h-0.5 bg-black" />
        <div className="w-8 h-0.5 bg-black" />
        <div className="w-8 h-0.5 bg-black" />
      </button>
      {menuOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-sky-100 ring-1 ring-black ring-opacity-5">
          <div
            className="py-1 flex flex-col justify-end"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <p className="block px-4 py-2 text-sm text-gray-700 text-right">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <span>{nickName}</span>
            </p>
            <Link href="/about" className="text-right">
              <button
                className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                role="menuitem"
              >
                アプリについて
              </button>
            </Link>
            <Link href="/settings" className="text-right">
              <button
                className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                role="menuitem"
              >
                設定
              </button>
            </Link>
            <Link href="/changepassword" className="text-right">
              <button
                className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                role="menuitem"
              >
                パスワード変更
              </button>
            </Link>
            <button
              onClick={() => logout()}
              className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
              role="menuitem"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
