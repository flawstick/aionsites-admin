import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <TooltipTrigger asChild>
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

export default OrderTableHeader;
