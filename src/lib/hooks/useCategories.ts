"use client";

import axios, { AxiosResponse } from "axios";
import { useRestaurantStore } from "../store/restaurantStore";
import useMenuStore from "../store/menuStore";

export function useCategories() {
  const restaurantId =
    useRestaurantStore.getState().selectedRestaurant?._id || "";
  const menuId = useRestaurantStore.getState().selectedRestaurant?.menu;
  const fetchNewCategories = useMenuStore.getState().fetchCategories;
  const deletedCategories: any = {};

  async function createCategory(category: any) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    const schemaCategory = {
      ...category,
      restaurantId: restaurantId,
      menuId: menuId,
    };

    try {
      response = await axios.post(
        `https://api.aionsites.com/menu/${restaurantId}/categories`,
        {
          category: schemaCategory,
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

    if (response?.status === 200) fetchNewCategories();
    return response?.status === 200;
  }

  async function editCategory(category: any) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    const schemaCategory = {
      ...category,
      restaurantId: restaurantId,
      menuId: menuId,
    };

    try {
      response = await axios.put(
        `https://api.aionsites.com/menu/${restaurantId}/categories/${category._id}`,
        {
          category: schemaCategory,
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

    if (response?.status === 200) fetchNewCategories();
    return response?.status === 200;
  }

  async function deleteCategory(categoryId: string) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    try {
      response = await axios.delete(
        `https://api.aionsites.com/menu/${restaurantId}/categories/${categoryId}`,
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

    // Cache category before deletion for undo functionality
    const categories = useMenuStore.getState().categories;
    const deletedCategory = categories.find((c: any) => c._id === categoryId);
    if (deletedCategory) {
      deletedCategories[deletedCategory._id] = deletedCategory;
    }

    if (response?.status === 200) fetchNewCategories();
    return response?.status === 200;
  }

  async function undoDeleteCategory(categoryId: string) {
    if (!deletedCategories[categoryId]) return;
    return await createCategory(deletedCategories[categoryId]);
  }

  async function getCategories(): Promise<AxiosResponse> {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    try {
      response = await axios.get(
        `https://api.aionsites.com/menu/${restaurantId}/categories`,
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

    return response?.data?.categories || [];
  }

  async function updateCategoryOrder(
    categories: { _id: string; index: number }[],
  ) {
    const jwt = localStorage.getItem("jwt");
    let response: any;
    const updatedCategories = categories.map((cat: any, index: number) => ({
      _id: cat._id,
      index: index,
    }));

    try {
      response = await axios.put(
        `https://api.aionsites.com/menu/${restaurantId}/categories/order`,
        {
          categories: updatedCategories,
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

    if (response?.status === 200) fetchNewCategories();
    return response?.status === 200;
  }

  return {
    createCategory,
    editCategory,
    deleteCategory,
    undoDeleteCategory,
    getCategories,
    updateCategoryOrder,
  };
}
