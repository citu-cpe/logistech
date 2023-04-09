import { createAxiosInstance } from "../axios";

export const useAxios = () => {
  const axios = createAxiosInstance();

  return axios;
};
