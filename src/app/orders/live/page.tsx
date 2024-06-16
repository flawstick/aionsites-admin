import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FilePenIcon, TruckIcon, CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import AuthProvider from "@/components/auth-provider";
import OrdersLayout from "@/components/orders-layout";

export default function LiveOrders() {
  return (
    <AuthProvider>
      <OrdersLayout>
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-6">Orders</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex items-center gap-4">
                <img
                  src="/placeholder.svg"
                  alt="Order Image"
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div>
                  <div className="font-semibold text-center text-sm">
                    Order #1234
                  </div>
                  <div className="text-xs text-center text-gray-500">
                    John Doe
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div>Date: June 15, 2023</div>
                  <div>Total: $99.99</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  Pending
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <FilePenIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TruckIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <CheckIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>
      </OrdersLayout>
    </AuthProvider>
  );
}
