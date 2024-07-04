import type { Metadata } from "next";
import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  description: "Aionsites restaurant admin menu dashboard",
  title: "Aionsites - Menu",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: RootLayoutProps) {
  return (
    <body
      className={cn("bg-muted/40 font-sans antialiased", fontSans.variable)}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  );
}
