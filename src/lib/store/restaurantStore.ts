import { create } from "zustand";
import mongoose from "mongoose";
import axios from "axios";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Restaurant {
  _id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  coordinates?: Coordinates;
}

interface MenuItem {
  _id?: any;
  name: string;
  price: number;
  description?: string;
  category?: string;
  additions?: [{ name: string; price: number }];
  sold?: number;
}

interface Menu {
  restaurantId: string;
  items: MenuItem[] | [] | null;
}

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menu: Menu;
  fetchRestaurants: (jwt: string, accountId: string) => Promise<void>;
  fetchMenu: (jwt: string) => Promise<void>;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (jwt: string, restaurantId: string) => void;
  createMenu: (jwt: string) => Promise<void>;
  addMenuItem: (menuItem: MenuItem) => void;
  removeMenuItem: (menuItemId: string) => void;
  saveMenu: (jwt: string, menu?: MenuItem[]) => Promise<boolean | undefined>;
  loadFromCache: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  menu: { restaurantId: "", items: [] },
  fetchRestaurants: async (jwt: string, accountId: string) => {
    try {
      const response = await axios.get(
        `https://api.aionsites.com/accounts/${accountId}/restaurants`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      const restaurants = response.data;
      set({ restaurants });
      if (restaurants.length > 0) {
        const selectedRestaurant = restaurants[0];
        set({ selectedRestaurant });
        set({ menu: { restaurantId: selectedRestaurant._id, items: [] } });
        await get().fetchMenu(jwt);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  },
  fetchMenu: async (jwt: string) => {
    const selectedRestaurant = get().selectedRestaurant;
    if (!selectedRestaurant) return;

    try {
      const response = await axios.get(
        `https://api.aionsites.com/restaurants/${selectedRestaurant._id}/menu`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      let menuItems = null;
      if (response.status === 200) menuItems = response.data;
      set({
        menu: { restaurantId: selectedRestaurant._id, items: menuItems },
      });

      // Save menu to localStorage
      localStorage.setItem(
        "menu",
        JSON.stringify({
          restaurantId: selectedRestaurant._id,
          items: menuItems,
        }),
      );
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  },
  addRestaurant: (restaurant: Restaurant) => {
    set((state) => ({
      restaurants: [...state.restaurants, restaurant],
    }));
  },
  updateRestaurant: (restaurant: Restaurant) => {
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r._id === restaurant._id ? restaurant : r,
      ),
    }));
  },
  setRestaurants: (restaurants: Restaurant[]) => {
    set({ restaurants });
  },
  setSelectedRestaurant: async (jwt: string, restaurantId: string) => {
    set((state) => ({
      selectedRestaurant:
        state.restaurants.find((r) => r._id === restaurantId) || null,
    }));
    await get().fetchMenu(jwt);
  },
  createMenu: async (jwt: string) => {
    const selectedRestaurant = get().selectedRestaurant;
    if (!selectedRestaurant) return;

    try {
      const response = await axios.post(
        `https://api.aionsites.com/restaurants/${selectedRestaurant._id}/menu/create`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.status === 200) {
        set({ menu: { restaurantId: selectedRestaurant._id, items: [] } });
      } else {
        console.error("Error creating menu:", response.data);
      }
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  },
  addMenuItem: (menuItem: MenuItem) => {
    set((state) => {
      const menuItemWithId = {
        ...menuItem,
        _id: new mongoose.Types.ObjectId(),
      };
      const updatedItems = state.menu.items
        ? [...state.menu.items, menuItemWithId]
        : [menuItemWithId];
      const updatedMenu = { ...state.menu, items: updatedItems };

      // Save updated menu to localStorage
      localStorage.setItem("menu", JSON.stringify(updatedMenu));

      return { menu: updatedMenu };
    });
  },
  removeMenuItem: (menuItemId: string) => {
    set((state) => {
      const updatedItems = state.menu.items
        ? state.menu.items.filter((item) => item._id !== menuItemId)
        : [];
      const updatedMenu = { ...state.menu, items: updatedItems };

      // Save updated menu to localStorage
      localStorage.setItem("menu", JSON.stringify(updatedMenu));

      return { menu: updatedMenu };
    });
  },
  saveMenu: async (jwt: string, menuItems?: MenuItem[]) => {
    const selectedRestaurant = get().selectedRestaurant;
    if (!selectedRestaurant) return;

    try {
      const response = await axios.put(
        `https://api.aionsites.com/restaurants/${selectedRestaurant._id}/menu`,
        { items: menuItems ? menuItems : get().menu.items },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.status !== 200) {
        console.error("Error saving menu:", response.data);
        return false;
      } else {
        // Clear the saved menu in localStorage after successful save
        localStorage.removeItem("menu");
        return true;
      }
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  },
  loadFromCache: () => {
    const cachedMenu = localStorage.getItem("menu");
    if (cachedMenu) {
      set({ menu: JSON.parse(cachedMenu) });
    }
  },
}));
