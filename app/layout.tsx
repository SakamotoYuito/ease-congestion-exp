import type { Metadata } from "next";
import { postLogEvent } from "@/lib/firebase/client";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export const metadata: Metadata = {
  title: "Enre",
  description: "混雑分散&グリーンインフラプロジェクト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPWA = () => {
    return (
      (typeof window !== "undefined" && window.navigator.standalone) ||
      (typeof window !== "undefined" &&
        window.matchMedia("(display-mode: standalone)").matches)
    );
  };
  if (isPWA()) postLogEvent("PWA");

  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/applicationIcon_512.png"></link>
        <link
          rel="apple-touch-startup-image"
          href="/applicationIcon_512.png"
        ></link>
        <meta name="theme-color" content="#fbe5d6" />
      </head>
      <body id="body" className={`inter ${inter.className} grid`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
