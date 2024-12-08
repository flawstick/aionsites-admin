import { create } from "zustand";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import axios from "axios";
import { IOrder as Order } from "@/types";

interface OrderState {
  orders: Order[];
  ordersHashmap: { [page: number]: Order[] };
  maxPages: number; // Total server pages available
  totalCount: number;
  currentServerPage: number; // The last server page we fetched
  loadedServerPages: number; // How many server pages are currently loaded
  fetchOrders: (page?: number) => Promise<void>;
  fetchMoreOrders: () => Promise<void>;
  fetchOrdersPage: (page: number) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: "pending" | "confirmed" | "done" | "cancelled" | "delivered",
  ) => void;
}

const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  ordersHashmap: {},
  maxPages: 1,
  totalCount: 0,
  currentServerPage: 1,
  loadedServerPages: 0, // initially no server pages loaded until we fetch

  fetchOrders: async (page: number = 1) => {
    const { selectedRestaurant } = useRestaurantStore.getState();
    try {
      const response = await axios.get(
        `https://api.aionsites.com/orders/restaurant/${selectedRestaurant?._id}?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
          },
        },
      );

      // Expected response:
      // { orders: [...], totalCount: number, maxPages: number }
      const { orders, maxPages, totalCount } = response.data;

      set(() => ({
        orders,
        // add key 1 to the map
        ordersHashmap: {
          ...get().ordersHashmap,
          [page]: orders,
        },
        maxPages,
        totalCount,
        currentServerPage: page,
        loadedServerPages: 1, // we just loaded the first server page
      }));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },

  fetchMoreOrders: async () => {
    const { selectedRestaurant } = useRestaurantStore.getState();
    const {
      currentServerPage,
      orders: currentOrders,
      maxPages,
      loadedServerPages,
    } = get();

    if (loadedServerPages >= maxPages) {
      // Already loaded all server pages
      console.log("No more orders to load.");
      return;
    }

    const nextPage = currentServerPage + 1;

    try {
      const response = await axios.get(
        `https://api.aionsites.com/orders/restaurant/${selectedRestaurant?._id}?page=${nextPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
          },
        },
      );
      const {
        orders: newOrders,
        maxPages: newMaxPages,
        totalCount,
      } = response.data;

      if (newOrders.length === 0) {
        // No new orders returned
        console.log("No more orders to load.");
        return;
      }

      set(() => ({
        orders: [...currentOrders, ...newOrders],
        ordersHashmap: {
          ...get().ordersHashmap,
          [nextPage]: newOrders,
        },
        maxPages: newMaxPages, // Update if server changes maxPages dynamically
        totalCount,
        currentServerPage: nextPage,
        loadedServerPages: loadedServerPages + 1, // One more server page loaded
      }));
    } catch (error) {
      console.error("Failed to fetch more orders:", error);
    }
  },
  fetchOrdersPage: async (page: number) => {
    const { selectedRestaurant } = useRestaurantStore.getState();
    try {
      const response = await axios.get(
        `https://api.aionsites.com/orders/restaurant/${selectedRestaurant?._id}?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
          },
        },
      );

      // Expected response:
      // { orders: [...], totalCount: number, maxPages: number }
      const { orders, maxPages, totalCount } = response.data;

      set(() => ({
        orders,
        // add key 1 to the map
        ordersHashmap: {
          ...get().ordersHashmap,
          [page]: orders,
        },
        maxPages,
        totalCount,
        currentServerPage: page,
        loadedServerPages: 1, // we just loaded the first server page
      }));
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
        { status },
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
}));

export default useOrderStore;
