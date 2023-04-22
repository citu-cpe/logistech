import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserDTO } from "generated-api";
import { useToast } from "native-base";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { useAuthStore } from "../stores/auth";
import { USER_QUERY_KEY } from "./useGetUser";

export const useUpdateUser = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const toast = useToast();

  return useMutation((dto: UpdateUserDTO) => api.updateUser(dto), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(USER_QUERY_KEY);
      toast.show({
        title: "Successfully updated profile",

        bgColor: "green.700",
        color: "green.50",
      });

      setUser(data);
    },
  });
};
