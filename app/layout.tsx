import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "崔崔 CUI CUI｜个人作品集",
  description: "崔崔的品牌视觉、海报、原创 IP 与动态影像作品集。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
