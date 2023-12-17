"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/authentication";
import { getUserFromCookie } from "@/lib/session";

export default function MenuComponent() {
  const [user, setUser] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUserFromCookie();
      if (user !== null) {
        const email = user.email;
        setUser(email?.split("@")[0] || "");
      }
    })();
  }, []);

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
        className="z-10 space-y-2"
      >
        <div className="w-8 h-0.5 bg-gray-600" />
        <div className="w-8 h-0.5 bg-gray-600" />
        <div className="w-8 h-0.5 bg-gray-600" />
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
              ログイン中: {user}
            </p>
            <button
              onClick={() => router.push("/changepassword")}
              className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
              role="menuitem"
            >
              パスワード変更
            </button>
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
