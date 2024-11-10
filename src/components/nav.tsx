"use client";

import { useEffect, useRef, useState } from "react";
import TeamSwitcher from "@/components/team-switcher";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { GrubIcon } from "@/components/icons";
import { CopySlash, Slash } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface HeaderProps {
  children: React.ReactNode;
  bg?: string;
  noBorder?: boolean;
}

export function Header({ children, bg, noBorder }: HeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const router = useRouter();
  const theme = useTheme();

  return (
    <>
      <header ref={ref}>
        <div
          className={`fixed flex h-16 inset-x-0 pr-4 items-center top-0 z-50 backdrop-blur-2xl duration-200 border-b ${
            isIntersecting
              ? `${bg ? bg : "bg-zinc-900/0"} ${noBorder && "border-none"}`
              : `bg-transparent `
          }`}
        >
          <MobileNav />
          <span
            className="flex cursor-pointer invert-[0.75] dark:invert-0 -ml-1"
            onClick={() => router.push("/")}
          >
            <GrubIcon className="h-[3.75rem] w-[4.25rem]" />
          </span>
          <span className="text-2xl font-bold -ml-2 mr-2 text-gray-500">
            <Slash className="h-5 w-5 -rotate-[20deg]" />
          </span>
          <TeamSwitcher />
          <MainNav className="hidden md:flex mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search className="hidden md:flex" />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="grid pt-16 min-h-screen grid-rows-[auto_1fr]">
        {children}
      </div>
    </>
  );
}
