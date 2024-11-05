import axios, { AxiosResponse } from "axios";
import { useRestaurantStore } from "../store/restaurantStore";
import useMenuStore from "../store/menuStore";

export function useModifiers() {
  let jwt = localStorage.getItem("jwt");
  let restaurantId =
    useRestaurantStore.getState().selectedRestaurant?._id || "";
  let menuId = useRestaurantStore.getState().selectedRestaurant?.menu;
  let fetchNewModifiers = useMenuStore.getState().fetchModifiers;
  let deletedModifiers: any = {};

  async function createModifier(modifier: any) {
    let response: any;
    let schemaModifier: any;
    try {
      schemaModifier = {
        ...modifier,
        restaurantId: restaurantId,
        menuId: menuId,
      };

      response = await axios.post(
        `https://api.aionsites.com/menu/${restaurantId}/modifiers`,
        {
          modifier: schemaModifier,
        },
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    if (response?.status === 200) fetchNewModifiers();
    return response?.status === 200;
  }

  async function editModifier(modifier: any) {
    let response: any;
    let schemaModifier: any;
    try {
      schemaModifier = {
        ...modifier,
        restaurantId: restaurantId,
        menuId: menuId,
      };

      response = await axios.put(
        `https://api.aionsites.com/menu/${restaurantId}/modifiers/${modifier._id}`,
        {
          modifier: schemaModifier,
        },
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    if (response?.status === 200) fetchNewModifiers();
    return response?.status === 200;
  }

  async function deleteModifier(modifierId: string) {
    let response: any;
    try {
      response = await axios.delete(
        `https://api.aionsites.com/menu/${restaurantId}/modifiers/${modifierId}`,
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    // cache before fetching to undo
    let modifiers = useMenuStore.getState().modifiers;
    let deletedModifier = modifiers.find((m: any) => m._id === modifierId);
    let deletedId = deletedModifier?._id as any;
    deletedModifiers[deletedId] = deletedModifier;

    if (response?.status === 200) fetchNewModifiers();
    return response?.status === 200;
  }

  async function undoDeleteModifier(modifierId: string) {
    if (!deletedModifiers[modifierId]) return;
    return await createModifier(deletedModifiers[modifierId]);
  }

  async function fetchModifiers(): Promise<AxiosResponse> {
    let response: any;
    try {
      response = await axios.get(
        `https://api.aionsites.com/menu/${restaurantId}/modifiers`,
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    return response?.data;
  }

  return {
    createModifier,
    editModifier,
    deleteModifier,
    undoDeleteModifier,
    fetchModifiers,
  };
}
