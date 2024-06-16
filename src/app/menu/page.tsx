"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/components/menu-admin";
import AuthProvider from "@/components/auth-provider";
import useAuth from "@/lib/hooks/useAuth";
import Loading from "@/components/loading";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

const RestaurantMenu = () => {
  const { session }: any = useAuth();
  const { fetchMenu } = useRestaurantStore();
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

  if (loading) return <Loading />;
  return <Menu />;
};

export default function Page() {
  return (
    <AuthProvider>
      <RestaurantMenu />
    </AuthProvider>
  );
}
