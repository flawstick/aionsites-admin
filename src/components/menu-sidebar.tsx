"use client";

import * as React from "react";
import { Pizza, Sparkles, Layers3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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

const data = {
  navMain: [
    {
      title: "Menu Items",
      url: "/menu/items",
      icon: Pizza,
    },
    {
      title: "Modifiers",
      url: "/menu/modifiers/",
      icon: Sparkles,
    },
    {
      title: "Categories",
      url: "/menu/categories/",
      icon: Layers3,
    },
  ],
};

interface MenuItemProps {
  breadcrumbs?: { title: string; url: string }[];
  children: React.ReactNode;
}

export function MenuSidebar({ breadcrumbs, children }: MenuItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isIntersecting, setIntersecting] = React.useState(true);
  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );
    observer.observe(ref?.current);
    return () => observer.disconnect();
  }, []);

  let [selected, setSelected] = React.useState(usePathname().split("/")[2]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup className="mt-16">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => router.push(item.url)}
                    className={
                      selected === item.url.split("/")[2]
                        ? "bg-primary/20 "
                        : ""
                    }
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
        <div className="flex" ref={ref}>
          <header
            className={`${"fixed"} flex flex-row justify-between h-16 shrink-0 items-center gap-2 transition-[width,height]
              ${isIntersecting ? "border-none" : "border-b"}
              ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-2xl
              bg-background z-50 w-full`}
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs?.map((item, index: number) => (
                    <>
                      {index !== 0 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={item.url}>
                          {item.title}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
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
  );
}
