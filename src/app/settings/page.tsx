import React from "react";
import AuthProvider from "@/components/auth-provider";
import RestaurantSettings from "@/components/settings/settings";

export default function Settings() {
  return (
    <AuthProvider>
      <RestaurantSettings />
    </AuthProvider>
  );
}
