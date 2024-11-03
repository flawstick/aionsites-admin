import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useAuth from "@/lib/hooks/useAuth";
import MenuManager from "@/components/menu-manager";
import { Header } from "@/components/nav";
import { MenuSidebar } from "./menu-sidebar";

const breadCrumbsPath = [
  { title: "Menu", url: "/menu/items" },
  { title: "Items", url: "/menu/items" },
];

export function Menu() {
  const { session }: any = useAuth();
  const { createMenu, menu } = useRestaurantStore();

  return (
    <Header>
      <MenuSidebar breadcrumbs={breadCrumbsPath}>
        <div className="grid min-h-screen grid-rows-[auto_1fr] mt-8">
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
      </MenuSidebar>
    </Header>
  );
}
