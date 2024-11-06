import axios, { AxiosResponse } from "axios";
import { useRestaurantStore } from "../store/restaurantStore";
import useMenuStore from "../store/menuStore";

export function useCategories() {
  const jwt = localStorage.getItem("jwt");
  const restaurantId =
    useRestaurantStore.getState().selectedRestaurant?._id || "";
  const menuId = useRestaurantStore.getState().selectedRestaurant?.menu;
  const fetchNewCategories = useMenuStore.getState().fetchCategories;
  const deletedCategories: any = {};

  async function createCategory(category: any) {
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

  return {
    createCategory,
    editCategory,
    deleteCategory,
    undoDeleteCategory,
    getCategories,
  };
}
