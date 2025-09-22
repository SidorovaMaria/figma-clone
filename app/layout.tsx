import type { Metadata } from "next";
import { Days_One, Rubik } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const daysOne = Days_One({
  variable: "--font-days-one",
  subsets: ["latin"],
  weight: "400",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Figma Clone - Live Collaboration",
  description: "A collaborative design tool built with Next.js and Liveblocks and Fabric.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${daysOne.variable} ${rubik.variable} antialiased`}>
        <Room>{children}</Room>
      </body>
    </html>
  );
}
