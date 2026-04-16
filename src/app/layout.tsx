import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赛博战友 - 发疯安慰剂",
  description: "全宇宙最暴躁的 AI 战友，专治各种内耗不服。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
