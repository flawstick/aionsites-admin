import { create } from "zustand";

interface AuthStore {
  jwt: string;
  setJwt: (jwt: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  jwt: "",
  setJwt: (jwt) => set({ jwt }),
}));
