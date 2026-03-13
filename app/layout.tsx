import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TwinLink - AI-Powered Matchmaking Platform",
  description: "Meet your digital twin and find your perfect match through AI-powered compatibility analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F1F5F9] transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
