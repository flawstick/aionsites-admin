"use client";

import axios, { AxiosResponse } from "axios";
import { useRestaurantStore } from "../store/restaurantStore";
import useMenuStore from "../store/menuStore";

export function useItems() {
  const restaurantId =
    useRestaurantStore.getState().selectedRestaurant?._id || "";
  const menuId = useRestaurantStore.getState().selectedRestaurant?.menu;
  const fetchNewItems = useMenuStore.getState().fetchMenuItems;
  const deletedItems: any = {};

  async function createItem(item: any) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    const schemaItem = {
      ...item,
      restaurantId: restaurantId,
    };

    try {
      response = await axios.post(
        `https://api.aionsites.com/menu/${restaurantId}/items`,
        {
          item: schemaItem,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    if (response?.status === 200) fetchNewItems();
    return response?.status === 200;
  }

  async function editItem(item: any) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    const schemaItem = {
      ...item,
      restaurantId: restaurantId,
      menuId: menuId,
    };

    try {
      response = await axios.put(
        `https://api.aionsites.com/menu/${restaurantId}/items/${item._id}`,
        {
          item: schemaItem,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    if (response?.status === 200) fetchNewItems();
    return response?.status === 200;
  }

  async function deleteItem(itemId: string) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    try {
      response = await axios.delete(
        `https://api.aionsites.com/menu/${restaurantId}/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    // Cache item before deletion for undo functionality
    const items = useMenuStore.getState().menuItems;
    const deletedItem = items.find((i: any) => i._id === itemId);
    if (deletedItem) {
      deletedItems[deletedItem._id] = deletedItem;
    }

    if (response?.status === 200) fetchNewItems();
    return response?.status === 200;
  }

  async function undoDeleteItem(itemId: string) {
    if (!deletedItems[itemId]) return;
    return await createItem(deletedItems[itemId]);
  }

  async function getItems(): Promise<AxiosResponse> {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    try {
      response = await axios.get(
        `https://api.aionsites.com/menu/${restaurantId}/items`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    return response?.data?.items || [];
  }

  async function updateModifiers(item: any) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    try {
      response = await axios.put(
        `https://api.aionsites.com/menu/${restaurantId}/items/${item._id}/modifiers`,
        {
          modifiers: item.modifiers,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    if (response?.status === 200) fetchNewItems();
    return response?.status === 200;
  }

  return {
    createItem,
    editItem,
    deleteItem,
    undoDeleteItem,
    getItems,
    updateModifiers,
  };
}
