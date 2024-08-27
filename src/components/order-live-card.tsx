"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckIcon,
  CheckCheckIcon,
  XIcon,
  TruckIcon,
} from "@/components/icons";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, CircleCheckIcon, CircleXIcon, ClockIcon } from "lucide-react";
import useOrderStore from "@/lib/store/orderStore";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

export default function OrderLiveCard({ order }: any) {
  const { updateOrderStatus } = useOrderStore();

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, "confirmed");
  };

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, "cancelled");
  };

  const handleDone = (orderId: string) => {
    updateOrderStatus(orderId, "done");
  };

  const [copied, setCopied] = React.useState<boolean>(false);
  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="w-3 h-3 mr-1" />;
      case "confirmed":
        return <CircleCheckIcon className="w-3 h-3 mr-1" />;
      case "done":
        return <CheckIcon className="w-3 h-3 mr-1" />;
      case "cancelled":
        return <CircleXIcon className="w-3 h-3 mr-1" />;
      case "delivered":
        return <TruckIcon className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "done":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "delivered":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return null;
    }
  };

  return (
    <Card key={order._id} className="overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-start bg-muted/50 px-4 py-3">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <span className="truncate w-1/2">Order {order._id}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      handleCopyOrderId(order._id);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 1000);
                    }}
                  >
                    {copied ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>{order.date}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Badge
            className={`flex flex-row items-center justify-center duration-300 ${getStatusColor(
              order.status,
            )}`}
          >
            {getStatusIcon(order.status)}
            <span className="text-sm">{order.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm flex-grow">
        <div className="grid gap-3 mt-4">
          <div className="font-semibold">{order.user.name}</div>
          <ul className="grid gap-3">
            {order.items.map((item: any, index: number) => (
              <li key={index} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt="Item Image"
                      width={32}
                      height={32}
                      className="object-cover w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-foreground">
                      {item.name} x<span>{item.quantity}</span>
                    </span>
                  </div>
                  <span>&#8362;{item.price?.toFixed(2)}</span>
                </div>
                {item.currentModifiers?.length > 0 && (
                  <div className="pl-4" dir="rtl">
                    <ul className="grid gap-3 mt-2">
                      {item.currentModifiers.map(
                        (
                          modifier: { options: Record<string, string> },
                          modIndex: number,
                        ) => (
                          <div key={modIndex} className="flex flex-col mt-2">
                            {Object.entries(modifier.options).map(
                              ([key, value], optIndex) => (
                                <li
                                  key={optIndex}
                                  className={`flex items-center justify-between ${
                                    item.currentModifiers[modIndex]?.options[
                                      key
                                    ] === value
                                      ? "font-bold"
                                      : "hidden"
                                  }`}
                                >
                                  <span className="font-semibold">{key}</span>
                                  <span className="ml-3 text-foreground">
                                    {value}
                                  </span>
                                </li>
                              ),
                            )}
                          </div>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {item.preferences && (
                  <div className="mt-8 transition-transform duration-300 ease-in-out transform hover:scale-105 group">
                    <Card className="overflow-hidden transform transition-all duration-300 hover:shadow hover:shadow-primary">
                      <CardContent className="p-4 text-sm">
                        <div className="text-center text-muted-foreground">
                          העדפות לקוח
                        </div>
                        <Separator className="my-2" />
                        <div
                          className="text-sm transform transition-all duration-300 group-hover:text-lg text-foreground text-right "
                          dir="rtl"
                        >
                          {item.preferences}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-semiboldu px-2">
            <span className="text-muted-foreground">Total</span>
            <span>&#8362;{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-3">
        {order.status === "pending" ? (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500">
                  <XIcon className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <p>Are you sure you want to reject this order?</p>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(order._id)}
                  >
                    Reject
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={() => handleAccept(order._id)}
              variant="ghost"
              className="flex flex-row items-center text-green-200"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </>
        ) : (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500">
                  <XIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <p>Are you sure you want to cancel this order?</p>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => handleDone(order._id)}>
              <CheckCheckIcon className="h-4 w-4 mr-2" />
              Done
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
