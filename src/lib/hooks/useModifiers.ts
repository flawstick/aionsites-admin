import axios from "axios";
import { useRestaurantStore } from "../store/restaurantStore";
import useAuth from "./useAuth";

export function useModifiers() {
  const { selectedRestaurant } = useRestaurantStore();
  const { session } = useAuth();

  function createModifier(modifier: any) {
    let response: any;
    try {
      response = axios.post(
        `https://api.aionsites.com/menu/${selectedRestaurant?._id}/modifiers`,
        {
          modifier,
        },
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${session.jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    return response?.status === 200;
  }

  function fetchModifiers() {
    let response: any;
    try {
      response = axios.get(
        `https://api.aionsites.com/menu/${selectedRestaurant?._id}/modifiers`,
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${session.jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }

    return response?.data;
  }

  return { createModifier, fetchModifiers };
}
