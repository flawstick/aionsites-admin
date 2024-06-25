import AuthProvider from "@/components/auth-provider";
import OrdersLayout from "@/components/orders-layout";

export default function LiveOrders() {
  return (
    <AuthProvider>
      <OrdersLayout />
    </AuthProvider>
  );
}
