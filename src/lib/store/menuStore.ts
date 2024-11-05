import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import { useModifiers } from "@/lib/hooks/useModifiers"; // Assuming `useMenu` is in this path
import { useRestaurantStore } from "@/lib/store/restaurantStore";

export interface Addition {
  name: string;
  price: number;
  multiple?: boolean;
  indexDaysAvailable?: number[];
  isSpicy?: boolean;
  spiceLevel?: number;
  vegan?: boolean;
  max?: number;
}

export interface Modifier {
  _id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: Addition[];
  max?: number;
  indexDaysAvailable?: number[];
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  modifiers: Modifier[]; // Array of modifiers
  sold?: number;
  spiceLevel?: number;
  isSpicy?: boolean;
  vegan?: boolean;
}

interface MenuState {
  menuItems: MenuItem[];
  modifiers: Modifier[];
  categories: string[];
  fetchMenuItems: () => void;
  fetchModifiers: () => void;
}

const useMenuStore = create<MenuState>()(
  devtools(
    persist(
      (set) => ({
        menuItems: [],
        modifiers: [],
        categories: [],

        fetchMenuItems: async () => {
          const { selectedRestaurant } = useRestaurantStore.getState();

          try {
            const response = await axios.get(
              `https://api.aionsites.com/menu/${selectedRestaurant?._id}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                },
              },
            );
            set(() => ({
              menuItems: response.data.items,
              categories: response.data.categories,
            }));
          } catch (error) {
            console.error("Failed to fetch menu items:", error);
          }
        },

        fetchModifiers: async () => {
          const { fetchModifiers } = useModifiers();

          try {
            const modifiers: any = await fetchModifiers();
            set(() => ({ modifiers }));
          } catch (error) {
            console.error("Failed to fetch modifiers:", error);
          }
        },
      }),
      {
        name: "menu-storage",
      },
    ),
  ),
);

export default useMenuStore;
