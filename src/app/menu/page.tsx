"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "@/components/menu-admin";
import AuthProvider from "@/components/auth-provider";
import useAuth from "@/lib/hooks/useAuth";
import Loading from "@/components/loading";
import { useRestaurantStore } from "@/lib/store/resturantStore";
import { Button } from "@/components/ui/button";

const RestaurantMenu = () => {
  const { session }: any = useAuth();
  const { menu, fetchMenu, selectedRestaurant } = useRestaurantStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (session) {
        setLoading(true);
        await fetchMenu(session.jwt);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <Menu menuData={menu.items} />;
};

export default function Page() {
  return (
    <AuthProvider>
      <RestaurantMenu />
    </AuthProvider>
  );
}
