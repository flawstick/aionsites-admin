"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useOrderStore from "@/lib/store/orderStore";
import OrderLiveCard from "@/components/order-live-card";
import { ArrowLeftIcon } from "lucide-react";
import { Header } from "@/components/nav";
import AuthProvider from "@/components/auth-provider";

export default function Component() {
  const { orders } = useOrderStore();
  const pendingOrders = orders.filter(
    (order: any) => order.status === "pending" || order.status === "confirmed",
  );

  return (
    <AuthProvider>
      <Header noBorder>
        <div className="mx-auto px-4 py-8">
          <header className="mb-8 flex items-center">
            <Link href="#" className="mr-4" prefetch={false}>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Live Orders</h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pendingOrders.map((order: any) => (
              <OrderLiveCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      </Header>
    </AuthProvider>
  );
}
