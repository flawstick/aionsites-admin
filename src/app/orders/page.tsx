"use client";

import { useEffect, useState } from "react";
import AuthProvider from "@/components/auth-provider";
import Loading from "@/components/loading";

const RestaurantMenu = () => {
  useEffect(() => {
    window.location.href = "/orders/live";
  }, []);

  return <Loading />;
};

export default function Page() {
  return (
    <AuthProvider>
      <RestaurantMenu />
    </AuthProvider>
  );
}
