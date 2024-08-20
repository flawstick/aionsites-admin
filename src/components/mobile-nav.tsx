"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react"; // Assuming you're using lucide-react for icons

export function MobileNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden mr-1">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex items-center flex-col text-center"
      >
        <SheetHeader>
          <SheetTitle>
            <span className="text-xl">Navigation</span>
          </SheetTitle>
        </SheetHeader>
        <nav className={cn("flex flex-col space-y-4", className)} {...props}>
          <Link
            href="/"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname === "/" && "text-primary",
            )}
          >
            Overview
          </Link>
          <Link
            href="/orders"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname.startsWith("/orders") && "text-primary",
            )}
          >
            Orders
          </Link>
          <Link
            href="/menu"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname.startsWith("/menu") && "text-primary",
            )}
          >
            Menu
          </Link>
          <Link
            href="/settings"
            className={cn(
              "text-md font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname.startsWith("/settings") && "text-primary",
            )}
          >
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
