import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LiffProvider } from "@/components/LiffProvider";

export const metadata: Metadata = {
  title: "愛的帝國 · Love Empire",
  description: "量化戀人互動的線上遊戲 — 動森 × 寶可夢 × 皮克敏 × 雙星神話 · 阿紅 × 阿藍",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8fcff5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="font-sans antialiased bg-gradient-to-br from-empire-cloud via-empire-mist to-empire-cloud min-h-screen text-empire-ink">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
