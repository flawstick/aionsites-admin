// /components/OrderListItem.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  CircleCheckIcon,
  CheckIcon,
  CircleXIcon,
  PrinterIcon,
} from "lucide-react";
import { Order } from "@/lib/store/orderStore";
import { TableRow, TableCell } from "@/components/ui/table";

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
    <TableRow className="hover:bg-gray-100" onMouseEnter={() => onHover(order)}>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium">{order._id}</div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">{order.userId}</div>
        <div className="text-sm text-muted-foreground">{order.date}</div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          {getStatusIcon(order.status)}
          <Badge>{order.status}</Badge>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
        ${order.total}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button variant="outline" size="sm">
          <PrinterIcon className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        <Button variant="destructive" size="sm">
          Cancel Order
        </Button>
      </TableCell>
    </TableRow>
  );
}
