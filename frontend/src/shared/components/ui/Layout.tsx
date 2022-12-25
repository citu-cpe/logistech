import { Box, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { Header } from './Header';
import { Navbar } from './Navbar';

export const Layout = (page: ReactElement) => {
  return (
    <Flex direction='row' minHeight='100vh'>
      <Navbar width='xs' display={{ base: 'none', lg: 'flex' }} />

      <Box
        as='main'
        backgroundColor='gray.800'
        color='whiteAlpha.900'
        flex='1'
        h='100vh'
        overflowY='auto'
        px='6'
        pt='6'
        pb='24'
      >
        <Header />

        {page}
      </Box>
    </Flex>
  );
};
