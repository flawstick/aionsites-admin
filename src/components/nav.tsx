"use client";

import { useEffect, useRef, useState } from "react";
import TeamSwitcher from "@/components/team-switcher";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  children: React.ReactNode;
  bg?: string;
}

export function Header({ children, bg }: HeaderProps) {
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

  return (
    <>
      <header ref={ref}>
        <div
          className={`fixed flex h-16 inset-x-0 px-4 items-center top-0 z-50 backdrop-blur duration-200 border-b  ${
            isIntersecting ? (bg ? bg : "bg-zinc-900/0") : "bg-transparent"
          }`}
        >
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
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
