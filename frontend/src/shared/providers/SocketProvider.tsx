import { createContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | undefined>(undefined);

let reviewAppUrl;

if (process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `${process.env.NEXT_PUBLIC_PREVIEW_URL_PREFIX}${prNumber}.up.railway.app`;
}

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || reviewAppUrl || 'http://localhost:5001';

export const SocketProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    const newSocket = io(baseURL);

    setSocket(() => newSocket);

    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
