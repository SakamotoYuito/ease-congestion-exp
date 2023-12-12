import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KSU-Congestion-Experiment",
  description: "Solve Congestion in KSU",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#b8e986" />
      </head>
      <body
        className={`inter ${inter.className}`}
        style={{ backgroundColor: "#b8e986", zIndex: 0 }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
