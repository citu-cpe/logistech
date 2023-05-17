import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar } from './Navbar';
import Link from 'next/link';
import { useGetUser } from '../../../modules/settings/hooks/useGetUser';
import { CompanyDTOTypeEnum, UserDTORoleEnum } from 'generated-api';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useGetUser();
  const user = data?.data;
  const companyType = user?.company?.type;

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

        {(companyType === CompanyDTOTypeEnum.Manufacturer ||
          companyType === CompanyDTOTypeEnum.Retailer ||
          user?.role === UserDTORoleEnum.Customer) && (
          <Box mr='8'>
            <Link href='/cart'>
              <FontAwesomeIcon icon={faCartShopping} size='2xl' />
            </Link>
          </Box>
        )}

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
