"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const t = useTranslations("MainNav");
  const { direction } = useDirection();
  const locale = useLocale();
  const router = useRouter();

  const navRef = useRef<HTMLElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [indicatorStyles, setIndicatorStyles] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [justActivated, setJustActivated] = useState(false);
  const [justRendered, setJustRendered] = useState(true);

  // Strip locale from pathname
  const currentPath = useMemo(() => {
    return pathname.replace(`/${locale}`, "") || "/";
  }, [pathname, locale]) as string;

  function getActiveRef() {
    if (currentPath === "/") return overviewRef;
    if (currentPath.startsWith("/orders")) return ordersRef;
    if (currentPath.startsWith("/menu")) return menuRef;
    if (currentPath.startsWith("/settings")) return settingsRef;
    return null;
  }

  function updateIndicator(ref: React.RefObject<HTMLElement>) {
    if (ref.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = ref.current.getBoundingClientRect();
      setIndicatorStyles({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    }
  }

  function handleItemMouseEnter(ref: React.RefObject<HTMLElement>) {
    if (!indicatorVisible) {
      // Indicator is currently hidden, so show it instantly with no animation
      updateIndicator(ref);
      setIndicatorVisible(true);
      setJustActivated(true);
    } else {
      // Indicator is already visible, animate to new position
      updateIndicator(ref);
      setJustActivated(false);
    }
  }

  function handleItemMouseLeave() {
    // Do nothing special here; vanish handled on nav mouse leave
  }

  function handleNavMouseLeave() {
    // Hide indicator instantly when leaving nav
    setIndicatorVisible(false);
    setJustActivated(false);
  }

  useEffect(() => {
    // On initial load or route change, highlight the active item if any
    const activeRef = getActiveRef();
    if (activeRef && activeRef.current && navRef.current) {
      updateIndicator(activeRef);
      setIndicatorVisible(false);
      // This might be considered a "justActivated" scenario since we're setting it from a route change
      // But if you want this to animate since it's presumably part of normal page load, set to false
      setJustActivated(true);
    } else {
      // No active ref, hide indicator
      setIndicatorVisible(false);
      setJustActivated(false);
      setIndicatorStyles({ left: 0, width: 0 });
    }
  }, [pathname]);

  useEffect(() => {
    function handleResize() {
      const activeRef = getActiveRef();
      if (
        activeRef &&
        activeRef.current &&
        navRef.current &&
        indicatorVisible
      ) {
        updateIndicator(activeRef);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, indicatorVisible]);

  useEffect(() => {
    // On initial render, set justRendered to false
    // This allows the indicator to animate in on first render
    setJustRendered(false);
  }, []);

  // Ensure the menu item is always visually focused if the path starts with /menu
  useEffect(() => {
    if (currentPath.startsWith("/menu")) {
      updateIndicator(menuRef);
      setIndicatorVisible(true); // Keep indicator visible
    }
  }, [currentPath]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "flex items-center gap-0 lg:gap-0 relative cursor-pointer",
        className,
      )}
      dir={direction}
      {...props}
      onMouseLeave={handleNavMouseLeave}
    >
      {/**
       * Key changes when indicatorVisible changes so the motion.div is remounted.
       * On remount, initial can run again, allowing a fresh, no-animation "spawn."
       */}
      <motion.div
        className="absolute top-0 h-full bg-accent z-0 rounded-lg"
        initial={{
          left: indicatorStyles.left,
          width: indicatorStyles.width,
          opacity: indicatorVisible ? 1 : 0,
        }}
        animate={{
          left: indicatorStyles.left,
          width: indicatorStyles.width,
          opacity: indicatorVisible ? 1 : 0,
        }}
        transition={
          justActivated
            ? {
                left: { duration: 0 }, // Instant left position update
                width: { duration: 0 }, // Instant width update
                opacity: {
                  duration: justRendered ? 0 : 0.2,
                  ease: "easeInOut",
                }, // Smooth opacity animation
              }
            : {
                left: { type: "spring", stiffness: 300, damping: 30 }, // Spring animation for left
                width: { type: "spring", stiffness: 300, damping: 30 }, // Spring animation for width
                opacity: { duration: 0.3, ease: "easeInOut" }, // Smooth opacity animation
              }
        }
      />

      <div
        className={cn(
          "relative z-10 text-sm font-medium p-2 text-muted-foreground transition-colors hover:text-primary duration-300 px-4",
          currentPath === "/" && "text-primary",
        )}
        ref={overviewRef}
        onClick={() => router.push(`/${locale}`)}
        onMouseEnter={() => handleItemMouseEnter(overviewRef)}
        onMouseLeave={handleItemMouseLeave}
      >
        {t("overview")}
      </div>
      <div
        className={cn(
          "relative z-10 text-sm font-medium p-2 text-muted-foreground transition-colors hover:text-primary duration-300 px-4",
          currentPath.startsWith("/orders") && "text-primary",
        )}
        ref={ordersRef}
        onClick={() => router.push(`/${locale}/orders`)}
        onMouseEnter={() => handleItemMouseEnter(ordersRef)}
        onMouseLeave={handleItemMouseLeave}
      >
        {t("orders")}
      </div>
      <div
        className={cn(
          "relative z-10 text-sm font-medium p-2 text-muted-foreground transition-colors hover:text-primary duration-300 px-4",
          currentPath.startsWith("/menu") && "text-primary",
        )}
        ref={menuRef}
        onClick={() => router.push(`/${locale}/menu`)}
        onMouseEnter={() => handleItemMouseEnter(menuRef)}
        onMouseLeave={handleItemMouseLeave}
      >
        {t("menu")}
      </div>
      <div
        className={cn(
          "relative z-10 text-sm font-medium p-2 text-muted-foreground transition-colors hover:text-primary duration-300 px-4",
          currentPath.startsWith("/settings") && "text-primary",
        )}
        ref={settingsRef}
        onClick={() => router.push(`/${locale}/settings`)}
        onMouseEnter={() => handleItemMouseEnter(settingsRef)}
        onMouseLeave={handleItemMouseLeave}
      >
        {t("settings")}
      </div>
    </nav>
  );
}
