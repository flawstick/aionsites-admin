import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios, { AxiosResponse } from "axios";
import { useModifiers } from "@/lib/hooks/useModifiers"; // Assuming `useMenu` is in this path
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { useCategories } from "../hooks/useCategories";

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

export interface Category {
  _id: string;
  name: string;
  description: string;
  index: number;
}

interface MenuState {
  menuItems: MenuItem[];
  modifiers: Modifier[];
  categories: Category[];
  fetchMenuItems: () => Promise<void>;
  fetchModifiers: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
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
          const { selectedRestaurant } = useRestaurantStore.getState();
          let response: any;
          let modifiers: Modifier[] = [];
          try {
            response = await axios.get(
              `https://api.aionsites.com/menu/${selectedRestaurant?._id}/modifiers`,

              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                  "Content-Type": "application/json",
                },
              },
            );
            modifiers = response?.data;
          } catch (error) {
            console.error(error);
          }
          set(() => ({ modifiers }));
        },
        fetchCategories: async () => {
          const { selectedRestaurant } = useRestaurantStore.getState();
          let response: any;
          try {
            response = await axios.get(
              `https://api.aionsites.com/menu/${selectedRestaurant?._id}/categories`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}` || "",
                  "Content-Type": "application/json",
                },
              },
            );
            set(() => ({ categories: response?.data?.categories }));
          } catch (error) {
            console.error(error);
          }

          return response?.data || [];
        },
        setCategories: (categories: Category[]) => set({ categories }),
      }),
      {
        name: "menu-storage",
      },
    ),
  ),
);

export default useMenuStore;
