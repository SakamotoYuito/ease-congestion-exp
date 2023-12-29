import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enre",
  description: "混雑分散&グリーンインフラプロジェクト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon2.png"></link>
        <meta name="theme-color" content="#fbe5d6" />
      </head>
      <body id="body" className={`inter ${inter.className} grid`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
