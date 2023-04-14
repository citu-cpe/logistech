import { useToast } from "native-base";
import { createAxiosInstance } from "../axios";
import { SecureStoreKeys, useAuthStore } from "../stores/auth";
import * as SecureStore from "expo-secure-store";
import { AxiosResponse } from "axios";
import { TokensDTO, UserDTO } from "generated-api";

export const useAxios = () => {
  const axios = createAxiosInstance();
  const toast = useToast();
  const { user } = useAuthStore();

  axios.interceptors.request.use(
    async (config) => {
      const accessToken = await SecureStore.getItemAsync(
        SecureStoreKeys.ACCESS_TOKEN
      );

      if (!!accessToken && !!config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (e) => Promise.reject(e)
  );

  axios.interceptors.response.use(
    (res: AxiosResponse<any>) => {
      return res;
    },
    async (e: any) => {
      if (!!e) {
        const { message, statusCode, invalidRefreshToken } = e.response.data;
        const refreshToken = await SecureStore.getItemAsync(
          SecureStoreKeys.REFRESH_TOKEN
        );

        if (
          refreshToken &&
          statusCode === 401 &&
          !invalidRefreshToken &&
          !e.config._retry
        ) {
          try {
            e.config._retry = true;

            const response = await axios.post<
              TokensDTO,
              AxiosResponse<TokensDTO>
            >("/auth/refresh", {
              refreshToken,
            });

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data;

            if (newAccessToken) {
              await SecureStore.setItemAsync(
                SecureStoreKeys.ACCESS_TOKEN,
                newAccessToken
              );
            }

            if (newRefreshToken) {
              await SecureStore.setItemAsync(
                SecureStoreKeys.REFRESH_TOKEN,
                newRefreshToken
              );
            }

            return axios(e.config);
            // tslint:disable:no-empty
          } catch (e) {}
        }

        // if error that's not an invalidRefreshToken error
        if (!invalidRefreshToken) {
          let description = "";

          if (message) {
            description = Array.isArray(message) ? message.join(", ") : message;
          }

          // FIXME
          toast.show({
            title: description || "Something went wrong",
            bgColor: "error.700",
            color: "error.50",
          });
        }

        if (invalidRefreshToken) {
          if (!!user) {
            await axios.post<UserDTO>("/auth/logout", user);
          }

          await Promise.all([
            SecureStore.deleteItemAsync(SecureStoreKeys.USER),
            SecureStore.deleteItemAsync(SecureStoreKeys.ACCESS_TOKEN),
            SecureStore.deleteItemAsync(SecureStoreKeys.REFRESH_TOKEN),
          ]);
        }

        return Promise.reject(e);
      }
    }
  );

  return axios;
};
