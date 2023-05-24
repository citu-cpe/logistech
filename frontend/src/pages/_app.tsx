import '../styles/globals.scss';
import '../shared/chartjs';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApiProvider } from '../shared/providers/ApiProvider';
import { useAuthStore } from '../shared/stores';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Layout } from '../shared/components/ui/Layout';
import { theme } from '../shared/theme';
import { SocketProvider } from '../shared/providers/SocketProvider';

export type AppPropsWithAuth = AppProps & {
  isAuth: boolean;
};

export type AppPropsWithLayout = AppPropsWithAuth & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout<P = AppPropsWithLayout, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? Layout;
  const { getUser, setUser } = useAuthStore();
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (user) {
      setUser(user);
    }

    if (pageProps.protected && !user) {
      router.replace('/login');
    } else if (pageProps.dontShowUser && user) {
      router.replace('/');
    } else {
      setShowPage(true);
    }
  }, [getUser, setUser, pageProps, router]);

  return (
    <SocketProvider>
      <ChakraProvider theme={theme}>
        <ApiProvider>
          <QueryClientProvider client={queryClient}>
            {showPage &&
              getLayout(<Component isAuth={!!getUser()} {...pageProps} />)}
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
          </QueryClientProvider>
        </ApiProvider>
      </ChakraProvider>
    </SocketProvider>
  );
}

export default MyApp;
