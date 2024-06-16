"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  BeefIcon,
  PackageIcon,
  SlidersVerticalIcon,
  LayersIcon,
} from "@/components/icons";
import { Header } from "@/components/nav";

interface OrdersLayoutProps {
  children: ReactNode;
}

export default function OrdersLayout({ children }: OrdersLayoutProps) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <Header />
      <div className="grid grid-cols-[280px_1fr]">
        <div className="border-r bg-white/40 dark:bg-gray-800/40">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link
                href="#"
                className="flex items-center gap-2 font-semibold"
                prefetch={false}
              >
                <BeefIcon className="h-6 w-6" />
                <span className="">Orders</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  <PackageIcon className="h-4 w-4" />
                  Live Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  <LayersIcon className="h-4 w-4" />
                  Order History
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  <SlidersVerticalIcon className="h-4 w-4" />
                  Order Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
