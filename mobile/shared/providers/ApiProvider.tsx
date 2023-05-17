import { createContext } from "react";
import { useAxios } from "../hooks/useAxios";
import { DefaultApi } from "generated-api";
import { platformUrl } from "../variables";

export const ApiContext = createContext<DefaultApi>(new DefaultApi());

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const axios = useAxios();

  const api = new DefaultApi(undefined, platformUrl, axios);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
