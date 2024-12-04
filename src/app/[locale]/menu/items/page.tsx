"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/components/menu-admin";
import useAuth from "@/lib/hooks/useAuth";
import Loading from "@/components/loading";
import useMenuStore from "@/lib/store/menuStore";

const RestaurantMenu = () => {
  const { session }: any = useAuth();
  const { fetchMenuItems, fetchModifiers } = useMenuStore();

  useEffect(() => {
    async function fetchData() {
      if (session) {
        await fetchMenuItems();
        await fetchModifiers();
      }
    }

    fetchData();
  }, []);

  return <Menu />;
};

export default function Page() {
  return <RestaurantMenu />;
}
