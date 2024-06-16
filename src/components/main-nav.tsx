"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname === "/" && "text-primary",
        )}
      >
        Overview
      </Link>
      <Link
        href="/orders"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/orders") && "text-primary",
        )}
      >
        Orders
      </Link>
      <Link
        href="/menu"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/menu") && "text-primary",
        )}
      >
        Menu
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname.startsWith("/settings") && "text-primary",
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
