"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import TeamSwitcher from "@/components/team-switcher";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { GrubIcon } from "@/components/icons";
import { Slash } from "lucide-react";
import { useRouter } from "next/navigation";
import { LocaleSwitcher } from "./locale-select";
import useAuth from "@/lib/hooks/useAuth";

interface NavbarProps {
  bg?: string;
  noBorder?: boolean;
}

export function Navbar({ bg, noBorder }: NavbarProps) {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const router = useRouter();
  const { status } = useAuth();
  let loading = React.useMemo(() => status === "loading", [status]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref}>
      <div
        className={`fixed flex h-16 inset-x-0 pr-4 rtl:pr-0 rtl:pl-4 items-center top-0 z-50 backdrop-blur-2xl duration-200 border-b ${
          isIntersecting
            ? `${bg ? bg : "bg-zinc-900/0"} ${noBorder && "border-none"}`
            : `bg-transparent `
        }`}
      >
        <MobileNav />
        <span
          className="hidden md:flex cursor-pointer invert-[0.75] dark:invert-0 ltr:-ml-1 rtl:-mr-1"
          onClick={() => router.push("/")}
        >
          <GrubIcon className="h-[3.75rem] w-[4.25rem]" />
        </span>
        <span className="hidden md:flex text-2xl font-bold ltr:-ml-2 rtl:-mr-2 ltr:mr-2 rtl:ml-2 text-gray-500">
          <Slash className="h-5 w-5 -rotate-[20deg]" />
        </span>
        {!loading && <TeamSwitcher />}
        <MainNav className="hidden md:flex mx-6" />
        <div className="ml-auto rtl:ml-2 rtl:mr-auto flex items-center gap-4">
          <div className="flex flex-row gap-2 items-center justify-center w-full">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          {!loading && <UserNav />}
        </div>
      </div>
    </header>
  );
}

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <>
      <Navbar />
      <div className="grid pt-16 min-h-screen grid-rows-[auto_1fr]">
        {children}
      </div>
    </>
  );
}
