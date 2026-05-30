import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "cyberSpace — Every room you enter shapes who you become.",
  description:
    "Events, internships, and community for KNUST students. Every room you enter shapes who you become.",
  openGraph: {
    title: "cyberSpace",
    description: "Discover events happening on and around KNUST campus.",
    siteName: "cyberSpace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#0F0F0E]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
