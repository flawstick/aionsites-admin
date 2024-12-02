import type { Metadata } from "next";
import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  description: "Grub restaurant admin menu modifiers page",
  title: "Grub - Modifiers",
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
    <body className={cn("font-sans antialiased", fontSans.variable)}>
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  );
}
