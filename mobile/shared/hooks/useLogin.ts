import { useMutation } from "@tanstack/react-query";
import { LoginUserDTO } from "generated-api";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";
import { useAuthStore } from "../stores/auth";

export const useLogin = () => {
  const api = useContext(ApiContext);
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

  return useMutation((loginDTO: LoginUserDTO) => api.logIn(loginDTO), {
    onSuccess: async ({ data }) => {
      const { user, tokens } = data;
      const { accessToken, refreshToken } = tokens;

      setUser(user);

      if (!!accessToken) {
        setAccessToken(accessToken);
      }

      if (!!refreshToken) {
        setRefreshToken(refreshToken);
      }
    },
  });
};
