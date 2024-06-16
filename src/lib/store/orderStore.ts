import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";

interface OrderItem {
  _id: string;
  quantity: number;
}

interface Order {
  _id: string;
  restaurantId: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "shipped" | "done" | "cancelled";
  imageSrc: string;
}

interface OrderState {
  orders: Order[];
  fetchOrders: () => void;
  updateOrderStatus: (
    orderId: string,
    status: "pending" | "shipped" | "done" | "cancelled",
  ) => void;
}

const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set) => ({
        orders: [],
        fetchOrders: async () => {
          try {
            const response = await axios.get("/api/orders");
            set({ orders: response.data });
          } catch (error) {
            console.error("Failed to fetch orders:", error);
          }
        },
        updateOrderStatus: async (
          orderId: string,
          status: "pending" | "shipped" | "done" | "cancelled",
        ) => {
          try {
            const response = await axios.put(`/api/orders/${orderId}`, {
              status,
            }); // Adjust this URL to your backend endpoint
            set((state) => ({
              orders: state.orders.map((order) =>
                order._id === orderId
                  ? { ...order, status: response.data.status }
                  : order,
              ),
            }));
          } catch (error) {
            console.error("Failed to update order status:", error);
          }
        },
      }),
      {
        name: "order-storage", // Persisted state key
      },
    ),
  ),
);

export default useOrderStore;
