import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AIAssistant } from "@/components/AIAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NIAT | NxtWave of Innovation in Advanced Technologies",
  description: "A centralized platform for NIAT students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col selection:bg-red-100 selection:text-red-900`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <AIAssistant />
      </body>
    </html>
  );
}
