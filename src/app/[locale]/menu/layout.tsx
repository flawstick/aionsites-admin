import type { Metadata } from "next";
import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn, isRTL } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { MenuSidebar } from "@/components/menu-sidebar";
import { Header } from "@/components/nav";

export const metadata: Metadata = {
  description: "Grub - Restaurant Menu",
  title: "Grub - Restaurant Menu",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!routing.locales.includes(locale as any)) notFound();
  let rtl = isRTL(locale);

  return (
    <body
      className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      dir={rtl ? "rtl" : "ltr"}
    >
      <Header>
        <MenuSidebar>{children}</MenuSidebar>
      </Header>
    </body>
  );
}
