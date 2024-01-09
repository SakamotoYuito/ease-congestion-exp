import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Favicon from "/public/applicationIcon_512.png";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enre",
  description: "混雑分散&グリーンインフラプロジェクト",
  icons: [{ rel: "icon", url: Favicon.src }],
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
        <SpeedInsights />
      </body>
    </html>
  );
}
