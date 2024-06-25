import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import axios from "axios";

export interface Order {
  _id: string;
  userId: string;
  restaurants: [restaurantId: [item: any]];
  date: string;
  total: number;
  status: "pending" | "shipped" | "done" | "cancelled";
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
          const { selectedRestaurant } = useRestaurantStore.getState();

          try {
            const response = await axios.get(
              `https://api.aionsites.com/orders/restaurant/${selectedRestaurant?._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                },
              },
            );
            set(() => ({ orders: response.data }));
          } catch (error) {
            console.error("Failed to fetch orders:", error);
          }
        },
        updateOrderStatus: async (
          orderId: string,
          status: "pending" | "shipped" | "done" | "cancelled",
        ) => {
          try {
            const response = await axios.put(
              `https://api.aionsites.com/${orderId}/status`,
              {
                status,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                },
              },
            ); // Adjust this URL to your backend endpoint
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
