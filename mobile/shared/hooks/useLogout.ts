import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { useAuthStore } from "../stores/auth";

export const useLogout = () => {
  const api = useContext(ApiContext);
  const { user, logout } = useAuthStore();

  return useMutation(() => api.logOut({ id: user!.id }), {
    onSuccess: () => {
      logout();
    },
  });
};
