import type { Metadata } from "next";
import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn, isRTL } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  description: "Aionsites Admin Dashboard",
  title: "Aionsites - Restaurant Admin",
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
  const messages = await getMessages();
  let rtl = isRTL(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
        dir={rtl ? "rtl" : "ltr"}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
