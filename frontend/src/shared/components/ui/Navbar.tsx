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
import { useLogout } from '../../../modules/index/hooks/useLogout';
import { NavLink } from './NavLink';

export const Navbar = (props: ChakraProps) => {
  const logout = useLogout().mutate;

  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      h='100vh'
      as='nav'
      {...props}
    >
      <Heading py='8' mx='12' h='10%'>
        LogisTech
      </Heading>

      <Box h='80%' overflowY='auto' my='4' ml='12'>
        <VStack as='ul' alignItems='flex-start' w='80%'>
          <NavLink href='/login'>Login</NavLink>
          <NavLink href='/register'>Register</NavLink>
          <NavLink href='/'>Home</NavLink>
          <NavLink href='/inventory'>Inventory</NavLink>
          <NavLink href='/red-flags'>Red Flags</NavLink>
          <NavLink href='/reports'>Reports</NavLink>
          <NavLink href='/invoice'>Invoice</NavLink>
          <NavLink href='/completed'>Completed</NavLink>
          <NavLink href='/settings'>Settings</NavLink>
        </VStack>
      </Box>

      <Menu>
        <MenuButton
          as={Box}
          h='10%'
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
          <Flex alignItems='center' gap='4'>
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
