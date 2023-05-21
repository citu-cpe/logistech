import { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { platformUrl } from "../variables";

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    const newSocket = io(platformUrl);
    console.log("connecting 1");

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
