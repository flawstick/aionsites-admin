import { create } from "zustand";
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
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  additions?: string[];
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
  createMenu: (jwt: string) => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  menu: { restaurantId: "", items: [] },
  fetchRestaurants: async (jwt: string, accountId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/accounts/${accountId}/restaurants`,
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
        `http://localhost:8080/restaurants/${selectedRestaurant._id}/menu`,
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
        `http://localhost:8080/restaurants/${selectedRestaurant._id}/menu/create`,
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
}));
