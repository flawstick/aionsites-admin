"use client";

import { useState, useEffect } from "react";
import useOrderStore, { Order } from "@/lib/store/orderStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File, ListFilter, Truck, MoreVertical, Copy } from "lucide-react";
import { RefreshIcon } from "@/components/icons";
import { OrderListItem } from "@/components/order-list-item";
import { Header } from "@/components/nav";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { calculateSaleGoals, formatDate } from "@/lib/utils";

export default function OrderLayout() {
  const { orders, fetchOrders } = useOrderStore();
  const { restaurants } = useRestaurantStore();
  const [hoveredOrder, setHoveredOrder] = useState<Order | null>(null);
  const [analytics, setAnalytics] = useState<{
    weeklyTotal: any;
    weeklyIncrease: any;
    monthlyTotal: any;
    monthlyIncrease: any;
  } | null>(null);

  // Animation keyframes
  const [isSpinning, setSpinning] = useState(false);

  const refreshOrders = () => {
    setSpinning(true);
    fetchOrders();
    setTimeout(() => {
      setSpinning(false);
    }, 1000);
  };

  useEffect(() => {
    fetchOrders();
    setAnalytics(calculateSaleGoals());
  }, [fetchOrders, restaurants]);

  return (
    <Header noBorder>
      <div className="flex min-h-screen w-full flex-col">
        <main className="grid flex-1 mt-4 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 mb-4">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>
                    <span>Your Orders</span>
                  </CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter>
              </Card>
              {analytics ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>This Week</CardDescription>
                      <CardTitle className="text-4xl">
                        ₪{analytics.weeklyTotal}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        {analytics.weeklyIncrease > 0
                          ? `+${analytics.weeklyIncrease.toFixed(2)}%`
                          : `${analytics.weeklyIncrease.toFixed(2)}%`}{" "}
                        from last week
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress
                        value={analytics.weeklyIncrease}
                        aria-label={`${analytics.weeklyIncrease.toFixed(
                          2,
                        )}% increase`}
                      />
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>This Month</CardDescription>
                      <CardTitle className="text-4xl">
                        ₪{analytics.monthlyTotal}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        {analytics.monthlyIncrease > 0
                          ? `+${analytics.monthlyIncrease.toFixed(2)}%`
                          : `${analytics.monthlyIncrease.toFixed(2)}%`}{" "}
                        from last month
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress
                        value={analytics.monthlyIncrease}
                        aria-label={`${analytics.monthlyIncrease.toFixed(
                          2,
                        )}% increase`}
                      />
                    </CardFooter>
                  </Card>{" "}
                </>
              ) : null}
            </div>
            <Tabs defaultValue="live">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="live">Live</TabsTrigger>
                  <TabsTrigger value="done">Done</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem>
                        Confirmed
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Done</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Cancelled
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="live">
                <Card>
                  <CardHeader className="px-7">
                    <OrderTableHeader
                      onRefresh={refreshOrders}
                      isSpinning={isSpinning}
                    />
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0
                          ? orders
                              .filter(
                                (order) =>
                                  order?.status === "confirmed" ||
                                  order?.status === "pending",
                              )
                              .map((order) => (
                                <OrderListItem
                                  key={order?._id}
                                  order={order}
                                  onHover={setHoveredOrder}
                                />
                              ))
                          : null}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="done">
                <Card>
                  <CardHeader className="px-7">
                    <OrderTableHeader
                      onRefresh={refreshOrders}
                      isSpinning={isSpinning}
                    />
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0
                          ? orders
                              .filter((order) => order?.status === "done")
                              .map((order) => (
                                <OrderListItem
                                  key={order._id}
                                  order={order}
                                  onHover={setHoveredOrder}
                                />
                              ))
                          : null}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="all">
                <Card>
                  <CardHeader className="px-7">
                    <OrderTableHeader
                      onRefresh={refreshOrders}
                      isSpinning={isSpinning}
                    />
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0
                          ? orders.map((order) => (
                              <OrderListItem
                                key={order._id}
                                order={order}
                                onHover={setHoveredOrder}
                              />
                            ))
                          : null}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <OrderCard hoveredOrder={hoveredOrder} />
          </div>
        </main>
      </div>
    </Header>
  );
}

interface OrderTableHeaderProps {
  onRefresh: () => void;
  isSpinning: boolean;
}

const OrderTableHeader: React.FC<OrderTableHeaderProps> = ({
  onRefresh,
  isSpinning,
}) => {
  return (
    <CardTitle className="flex flex-row items-center justify-between">
      <span className="text-xl">Orders</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              variant="ghost"
              onClick={onRefresh}
              className={`${isSpinning ? "animate-spin" : ""}`}
            >
              <RefreshIcon className="w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardTitle>
  );
};

const OrderCard: React.FC<{ hoveredOrder: any }> = ({ hoveredOrder }) => {
  return (
    <div className="relative">
      <Card className="fixed overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              <span className="truncate w-[25vh]">
                Order {hoveredOrder?._id}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => navigator.clipboard.writeText(hoveredOrder?._id)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              {formatDate(hoveredOrder?.createdAt)}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Track Order
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {hoveredOrder?.items.map((item: any, index: number) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item?.name} x {item?.quantity}
                  </span>
                  <span>₪{item?.price}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₪{hoveredOrder?.totalPrice}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₪0.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₪0.00</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>₪{hoveredOrder?.totalPrice}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{hoveredOrder?.userId}</span>
                <span>1234 Main St.</span>
                <span>Anytown, CA 12345</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{hoveredOrder?.user.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Company</dt>
                <dd>{hoveredOrder?.tenantId}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            <time dateTime={formatDate(hoveredOrder?.createdAt)}>
              {formatDate(hoveredOrder?.createdAt)}
            </time>
          </div>
        </CardFooter>
        {!hoveredOrder && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
            <span className="text-white text-lg">
              Hover over an order to render
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};
