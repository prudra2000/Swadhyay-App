import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swadhyay",
  description: "Digital collection of Swamini Vato with transliteration",
  manifest: "/manifest.json",
  applicationName: "Swamini Vato",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Swadhyay",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#e67e22",
  icons: {
    icon: [
      {
        url: "/icons/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/ios/152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/ios/120.png", sizes: "120x120", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Swamini Vato" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#e67e22" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/ios/180.png"
          sizes="180x180"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/ios/152.png"
          sizes="152x152"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/ios/120.png"
          sizes="120x120"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
