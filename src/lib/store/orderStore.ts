import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import axios from "axios";

export interface OrderItem {
  _id?: any;
  restaurantId?: any;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  modifiers?: any;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  user: any;
  items: any;
  date: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "done" | "cancelled" | "delivered";
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  fetchOrders: () => void;
  updateOrderStatus: (
    orderId: string,
    status: "pending" | "confirmed" | "done" | "cancelled" | "delivered",
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
          status: "pending" | "confirmed" | "done" | "cancelled" | "delivered",
        ) => {
          try {
            const response = await axios.put(
              `https://api.aionsites.com/orders/${orderId}/status`,
              {
                status,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                },
              },
            );
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
        name: "order-storage",
      },
    ),
  ),
);

export default useOrderStore;
