import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy, MoreVertical, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { IOrder as Order } from "@/types";

interface OrderCardProps {
  hoveredOrder: Order | null;
}

const OrderCard: React.FC<OrderCardProps> = ({ hoveredOrder }) => {
  return (
    <div className="relative">
      {/* Add a fixed width class here */}
      <Card className="fixed overflow-hidden w-[30vw]">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              <span className="truncate w-[25vh]">
                {hoveredOrder
                  ? `Order ${hoveredOrder._id}`
                  : "No Order Selected"}
              </span>
              {hoveredOrder && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() =>
                          hoveredOrder?._id &&
                          navigator.clipboard.writeText(hoveredOrder._id)
                        }
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Order ID</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <CardDescription>
              {hoveredOrder ? formatDate(hoveredOrder.createdAt) : ""}
            </CardDescription>
          </div>
          {hoveredOrder && (
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
          )}
        </CardHeader>
        <CardContent className="p-6 text-sm">
          {hoveredOrder ? (
            <>
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  {hoveredOrder?.items.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
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
                    <span>{hoveredOrder?.address}</span>
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
                    <dd>{hoveredOrder?.customerName}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Company</dt>
                    <dd>{hoveredOrder?.tenantId}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <span className="text-muted-foreground">
                Hover over an order to view details.
              </span>
            </div>
          )}
        </CardContent>
        {hoveredOrder && (
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated{" "}
              <time dateTime={formatDate(hoveredOrder?.createdAt)}>
                {formatDate(hoveredOrder?.createdAt)}
              </time>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OrderCard;
