import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/component/ThemeProvider";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shubham 🐺",
  description: "systems programming enthusiast. projects: yapl (lang) | ykvs (db) | gb emulator (hardware) TS for money 💰| Go & C for fun | football | Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="08795343-d7f4-49b9-884a-ed1c0b1277ee"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
