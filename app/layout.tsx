import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LiffProvider } from "@/components/LiffProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AuthResume } from "@/components/AuthResume";

export const metadata: Metadata = {
  title: "愛的帝國 · Love Empire",
  description: "把日常關係量化成遊戲 — 任務、寵物、記憶卡、深度問答、人生清單，兩人專屬的愛情冒險",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "愛的帝國",
  },
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
        <AuthResume />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
