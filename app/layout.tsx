import type { Metadata, Viewport } from "next";
import "./globals.css";

export const dynamic = "force-static";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const publicUrl = (path: string) => `${pagesBasePath}${path}`;

export const metadata: Metadata = {
  title: "轻松英语 | 日常英语入门",
  description: "适合英语初学者的日常句子、简单对话与儿童单词练习，支持浏览器英文朗读。",
  applicationName: "轻松英语",
  manifest: publicUrl("/manifest.json"),
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "轻松英语",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: publicUrl("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: publicUrl("/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: publicUrl("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f513f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}
