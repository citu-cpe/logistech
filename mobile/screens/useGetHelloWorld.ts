import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../shared/providers/ApiProvider";

export const HELLO_WORLD_QUERY_KEY = ["hello"];

export const useGetHelloWorld = () => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: HELLO_WORLD_QUERY_KEY,
    queryFn: () => {
      return api.getHello();
    },
  });
};
