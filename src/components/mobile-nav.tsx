"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ShoppingBag as OrdersIcon,
  BookOpen as MenuItemIcon,
  Settings as SettingsIcon,
} from "lucide-react"; // Importing necessary icons
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";

export function MobileNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("MobileNav"); // Initialize translations with the "MobileNav" namespace
  const pathname = usePathname();
  const { rtl } = useDirection();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden mr-1">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={rtl ? "right" : "left"}
        className="flex items-center flex-col text-center"
      >
        <SheetHeader>
          <SheetTitle>
            <span className="text-xl">{t("navigation")}</span>
          </SheetTitle>
        </SheetHeader>
        <nav
          className={cn("flex flex-col space-y-4 mt-4", className)}
          {...props}
        >
          <Link
            href="/"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary flex items-center",
              pathname === "/" && "text-primary",
            )}
          >
            <HomeIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            {t("overview")}
          </Link>
          <Link
            href="/orders"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary flex items-center",
              pathname.startsWith("/orders") && "text-primary",
            )}
          >
            <OrdersIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            {t("orders")}
          </Link>
          <Link
            href="/menu"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary flex items-center",
              pathname.startsWith("/menu") && "text-primary",
            )}
          >
            <MenuItemIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            {t("menu")}
          </Link>
          <Link
            href="/settings"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary flex items-center",
              pathname.startsWith("/settings") && "text-primary",
            )}
          >
            <SettingsIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            {t("settings")}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
