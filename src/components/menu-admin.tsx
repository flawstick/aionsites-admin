import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BeefIcon,
  SlidersVerticalIcon,
  PackageIcon,
  LayersIcon,
} from "@/components/icons";
import TeamSwitcher from "@/components/team-switcher";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useAuth from "@/lib/hooks/useAuth";
import MenuManager from "./menu-manager";

export function Menu() {
  const { session }: any = useAuth();
  const { createMenu, menu } = useRestaurantStore();

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </header>
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
                <span className="">Menu</span>
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
                  Menu Items
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  <LayersIcon className="h-4 w-4" />
                  Categories
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  <SlidersVerticalIcon className="h-4 w-4" />
                  Modifiers
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {menu.items !== null && <MenuManager />}
          </main>
        </div>
        {!menu.items && (
          <div className="flex items-center justify-center flex-col my-10">
            <p className="text-lg text-gray-500">
              Your restaurant doesn&apos;t have a menu yet
            </p>
            <p className="text-lg font-bold text-gray-700">Create one?</p>
            <Button
              onClick={() => {
                createMenu(session.jwt);
              }}
              className="flex items-center"
              variant="outline"
            >
              Create Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
