import {
  Avatar,
  Box,
  ChakraProps,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { UserDTORoleEnum } from 'generated-api';
import { useLogout } from '../../../modules/index/hooks/useLogout';
import { useGlobalStore } from '../../stores';
import { NavLink } from './NavLink';

export const Navbar = (props: ChakraProps) => {
  const logout = useLogout().mutate;
  const getUser = useGlobalStore((state) => state.getUser);
  const user = getUser();
  const role = user?.role;

  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      h='100vh'
      as='nav'
      backgroundColor='blackAlpha.400'
      {...props}
    >
      <Heading py='8' mx='12' h='20'>
        LogisTech
      </Heading>

      <Box overflowY='auto' my='4' ml='12' flexGrow='1'>
        <VStack as='ul' alignItems='flex-start' w='80%'>
          <NavLink href='/'>Home</NavLink>

          {(role === UserDTORoleEnum.Supplier ||
            role === UserDTORoleEnum.Manufacturer ||
            role === UserDTORoleEnum.Retailer) && (
            <NavLink href='/products'>Products</NavLink>
          )}

          {(role === UserDTORoleEnum.StorageFacility ||
            role === UserDTORoleEnum.Manufacturer) && (
            <NavLink href='/inventory'>Inventory</NavLink>
          )}

          <NavLink href='/red-flags'>Red Flags</NavLink>

          <NavLink href='/reports'>Reports</NavLink>

          {(role === UserDTORoleEnum.Supplier ||
            role === UserDTORoleEnum.Retailer) && (
            <NavLink href='/contacts'>Contacts</NavLink>
          )}

          {(role === UserDTORoleEnum.Manufacturer ||
            role === UserDTORoleEnum.Retailer) && (
            <NavLink href='/sold'>Sold</NavLink>
          )}

          {role === UserDTORoleEnum.Manufacturer && (
            <NavLink href='/ordered'>Ordered</NavLink>
          )}

          {role === UserDTORoleEnum.Supplier && (
            <NavLink href='/received'>Received</NavLink>
          )}

          {role === UserDTORoleEnum.StorageFacility && (
            <NavLink href='/invoice'>Invoice</NavLink>
          )}

          {role === UserDTORoleEnum.StorageFacility && (
            <NavLink href='/completed'>Completed</NavLink>
          )}
          <NavLink href='/settings'>Settings</NavLink>
        </VStack>
      </Box>

      <Menu>
        <MenuButton
          as={Box}
          h='20'
          px='12'
          cursor='pointer'
          borderRadius='md'
          _hover={{
            background: 'whiteAlpha.400',
          }}
          transition='all 0.2s ease-in-out'
          display='flex'
          alignItems='center'
          data-cy='user-profile-btn'
        >
          <Flex align='center' gap='4'>
            <Avatar mr='2' />
            <Text fontWeight='bold'>User Profile</Text>
          </Flex>
        </MenuButton>

        <MenuList>
          <MenuItem onClick={() => logout()} data-cy='logout-btn'>
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
