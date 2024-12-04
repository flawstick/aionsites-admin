"use client";

import * as React from "react";
import { Pizza, Sparkles, Layers3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "./ui/scroll-area";
import { useDirection } from "@/hooks/use-direction";
import { Navbar } from "@/components/nav";
import AuthProvider from "./auth-provider";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Menu Items",
      url: "/menu/items",
      icon: Pizza,
    },
    {
      title: "Modifiers",
      url: "/menu/modifiers",
      icon: Sparkles,
    },
    {
      title: "Categories",
      url: "/menu/categories",
      icon: Layers3,
    },
  ],
};

interface MenuItemProps {
  children: React.ReactNode;
}

export function MenuSidebar({ children }: MenuItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { rtl, direction } = useDirection();

  const [isIntersecting, setIntersecting] = React.useState(true);

  // Observe the intersection of the header
  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Derive breadcrumbs from the current pathname
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean).slice(1);
    return segments.map((segment, index) => {
      const url = `/${segments.slice(0, index + 1).join("/")}`;
      const title = segment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
      return { title, url };
    });
  }, [pathname]);

  // Check if a sidebar item is selected
  const selectedItem = React.useMemo(
    () =>
      data.navMain.find((item) => pathname.startsWith(`/${locale}${item.url}`)),
    [pathname, locale],
  );

  return (
    <AuthProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon" side={rtl ? "right" : "left"}>
          <SidebarContent>
            <SidebarGroup className="mt-16">
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => router.push(`/${locale}${item.url}`)}
                      className={cn(
                        selectedItem?.url === item.url
                          ? "text-white dark:text-primary-foreground bg-primary hover:bg-primary/90 dark:bg-primary/20 dark:hover:bg-primary/30"
                          : "",
                        "transition-colors",
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <Navbar />
          <div className="flex mt-16" ref={ref}>
            <header
              className={`fixed flex flex-row justify-between h-16 shrink-0 items-center gap-2 transition-[width,height]
              ${isIntersecting ? "border-none" : "border-b"}
              ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-2xl
              bg-background z-50 w-full`}
            >
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="rtl:-ml-1 ltr:-mr-1" />
                <Separator
                  orientation="vertical"
                  className="rtl:ml-2 ltr:mr-2 h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={item.url}>
                        {index !== 0 && (
                          <BreadcrumbSeparator
                            className="hidden md:block"
                            dir={direction}
                          />
                        )}
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href={`/${item.url}`}>
                            {item.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
          </div>
          <ScrollArea className="flex mt-16 px-8 min-h-screen">
            {children}
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
