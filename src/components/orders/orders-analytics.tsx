import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AnalyticsProps {
  analytics: {
    weeklyTotal: number;
    weeklyIncrease: number;
    monthlyTotal: number;
    monthlyIncrease: number;
  } | null;
}

const OrderAnalytics: React.FC<AnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <>
        <Skeleton className="rounded-xl" />
        <Skeleton className="rounded-xl" />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">₪{analytics.weeklyTotal}</CardTitle>
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
            aria-label={`${analytics.weeklyIncrease.toFixed(2)}% increase`}
          />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-4xl">₪{analytics.monthlyTotal}</CardTitle>
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
            aria-label={`${analytics.monthlyIncrease.toFixed(2)}% increase`}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default OrderAnalytics;
