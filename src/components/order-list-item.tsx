"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from "@/lib/store/orderStore";
import {
  ClockIcon,
  CircleCheckIcon,
  CheckIcon,
  CircleXIcon,
} from "lucide-react";

interface OrderListItemProps {
  order: Order;
  onHover: (order: Order) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <ClockIcon className="w-5 h-5" />;
    case "shipped":
      return <CircleCheckIcon className="w-5 h-5" />;
    case "done":
      return <CheckIcon className="w-5 h-5" />;
    case "cancelled":
      return <CircleXIcon className="w-5 h-5" />;
    default:
      return null;
  }
};

export function OrderListItem({ order, onHover }: OrderListItemProps) {
  return (
    <TableRow onMouseEnter={() => onHover(order)}>
      <TableCell>
        <div className="text-sm font-medium">{order.userId}</div>
        <div className="text-sm text-muted-foreground">{order._id}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="text-sm">balls</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1">
          {getStatusIcon(order.status)}
          <Badge>{order.status}</Badge>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm">{order.date}</div>
      </TableCell>
      <TableCell className="text-right text-sm">${order.total}</TableCell>
    </TableRow>
  );
}
