"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { addDays } from "date-fns";
import useOrderStore from "@/lib/store/orderStore";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { calculateSaleGoals } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { IOrder as Order } from "@/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

import OrderTable from "@/components/orders/orders-table";
import OrderCard from "@/components/orders/orders-card";
import OrderAnalytics from "@/components/orders/orders-analytics";
import { exportAsDOCX, exportAsXLSX } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsState {
  weeklyTotal: number;
  weeklyIncrease: number;
  monthlyTotal: number;
  monthlyIncrease: number;
}

const OrderLayout: React.FC = () => {
  const { orders, fetchOrders, maxPages, fetchMoreOrders } = useOrderStore();
  const { restaurants } = useRestaurantStore();

  const [hoveredOrder, setHoveredOrder] = useState<Order | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsState | null>(null);
  const [isSpinning, setSpinning] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });

  const loading = useMemo(
    () => orders.length === 0 || isSpinning,
    [orders, isSpinning],
  );

  const refreshOrders = useCallback(() => {
    setSpinning(true);
    fetchOrders().then(() => setSpinning(false));
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
    (async () => {
      let sales = await calculateSaleGoals();
      setAnalytics(sales);
    })();
  }, [fetchOrders, restaurants]);

  const filteredAllOrders = useMemo(() => orders, [orders]);
  const filteredPendingOrders = useMemo(
    () =>
      orders?.filter(
        (order) => order.status === "confirmed" || order.status === "pending",
      ),
    [orders],
  );
  const filteredDoneOrders = useMemo(
    () => orders?.filter((order) => order.status === "done"),
    [orders],
  );

  const handleExportXLSX = useCallback(() => {
    if (date?.from && date?.to) exportAsXLSX(orders, date.from, date.to);
  }, [orders, date]);

  const handleExportDOCX = useCallback(() => {
    if (date?.from && date?.to) exportAsDOCX(orders, date.from, date.to);
  }, [orders, date]);

  return (
    <div className="flex flex-col">
      <main className="grid flex-1 mt-4 items-start gap-4 p-4 sm:px-6 sm:py-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mb-4">
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 mb-4">
            {loading ? (
              <Card className="sm:col-span-2 h-[180px] flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <Skeleton className="w-1/3 h-6 mb-2" />
                  <Skeleton className="w-full h-12" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="w-32 h-8" />
                </CardFooter>
              </Card>
            ) : (
              <Card className="sm:col-span-2 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <CardTitle>
                    <span className="text-lg">Live Order Feed</span>
                  </CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Live Orders page. Get Real-Time
                    Updates on Orders Placed by Your Customers.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => (window.location.href = "/orders/live")}
                  >
                    Go To Live Orders
                  </Button>
                </CardFooter>
              </Card>
            )}
            <OrderAnalytics analytics={analytics} />
          </div>
          <Tabs defaultValue="all">
            <div className="flex flex-row justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="done">Done</TabsTrigger>
              </TabsList>
              <div className="flex items-center mb-2">
                <div className="ml-auto flex items-center gap-2">
                  <CalendarDateRangePicker setDate={setDate} date={date} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="h-7 gap-1 text-sm">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Export</span>
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleExportXLSX}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel Spreadsheet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportDOCX}>
                        <FileText className="h-4 w-4 mr-2" />
                        Word Document
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <TabsContent value="live">
              <OrderTable
                description="Live orders currently being handled."
                orders={filteredPendingOrders}
                isLoading={isSpinning}
                onHover={setHoveredOrder}
                onRefresh={refreshOrders}
                isSpinning={isSpinning}
                maxPages={maxPages}
                onFetchMore={fetchMoreOrders}
              />
            </TabsContent>
            <TabsContent value="done">
              <OrderTable
                description="Done orders from your store."
                orders={filteredDoneOrders}
                isLoading={isSpinning}
                onHover={setHoveredOrder}
                onRefresh={refreshOrders}
                isSpinning={isSpinning}
                maxPages={maxPages}
                onFetchMore={fetchMoreOrders}
              />
            </TabsContent>
            <TabsContent value="all">
              <OrderTable
                description="All orders from your store."
                orders={filteredAllOrders}
                isLoading={isSpinning}
                onHover={setHoveredOrder}
                onRefresh={refreshOrders}
                isSpinning={isSpinning}
                maxPages={maxPages}
                onFetchMore={fetchMoreOrders}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <OrderCard hoveredOrder={hoveredOrder} />
        </div>
      </main>
    </div>
  );
};

export default OrderLayout;
