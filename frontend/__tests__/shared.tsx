import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextRouter } from 'next/router';
import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { ApiProvider } from '../src/shared/providers/ApiProvider';

const queryClient = new QueryClient();
export const mockNextRouter = (router: Partial<NextRouter>): NextRouter => ({
  basePath: '',
  pathname: '',
  route: '',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  reload: jest.fn(),
  forward: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
  ...router,
});

export const renderWithProviders = (node: React.ReactNode) => {
  const router = mockNextRouter({});
  return render(
    <RouterContext.Provider value={router}>
      <ChakraProvider theme={theme}>
        <ApiProvider>
          <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>
        </ApiProvider>
      </ChakraProvider>
    </RouterContext.Provider>
  );
};
