"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const t = useTranslations("MainNav");
  const { direction } = useDirection();

  return (
    <nav
      className={cn("flex items-center gap-4 lg:gap-6", className)}
      dir={direction}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname === "/" && "text-primary",
        )}
      >
        {t("overview")}
      </Link>
      <Link
        href="/orders"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/orders") && "text-primary",
        )}
      >
        {t("orders")}
      </Link>
      <Link
        href="/menu"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/menu") && "text-primary",
        )}
      >
        {t("menu")}
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/settings") && "text-primary",
        )}
      >
        {t("settings")}
      </Link>
    </nav>
  );
}
