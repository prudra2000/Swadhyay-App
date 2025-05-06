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
  title: "Swamini Vato",
  description: "Digital collection of Swamini Vato with transliteration",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/Icon.png",
        href: "/Icon.png",
      },
    ],
    apple: {
      url: "/Icon.png",
      sizes: "180x180",
      href: "/Icon.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
