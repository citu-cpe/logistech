import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Navbar } from './Navbar';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        justify={{ base: 'space-between', lg: 'flex-end' }}
        align='center'
        mb='10'
      >
        <Button
          variant='ghost'
          display={{ base: 'block', lg: 'none' }}
          onClick={onOpen}
        >
          <HamburgerIcon />
        </Button>

        <Flex
          backgroundColor='gray.700'
          borderRadius='full'
          h={{ base: '14', md: '20' }}
          w={{ base: '14', md: '20' }}
          justify='center'
          align='center'
        >
          <Text textAlign='center' fontSize={{ base: '2xs', md: 'md' }}>
            System Logo
          </Text>
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
        <DrawerOverlay />

        <DrawerContent>
          <Navbar backgroundColor='blackAlpha.700' color='whiteAlpha.900' />
        </DrawerContent>
      </Drawer>
    </>
  );
};
