import { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { baseURL } from "./ApiProvider";

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    const newSocket = io(baseURL);

    setSocket(newSocket);

    newSocket.on("test", () => {});

    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
