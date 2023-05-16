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
import { CompanyDTOTypeEnum, UserDTORoleEnum } from 'generated-api';
import { useLogout } from '../../../modules/index/hooks/useLogout';
import { useGetUser } from '../../../modules/settings/hooks/useGetUser';
import { NavLink } from './NavLink';

export const Navbar = (props: ChakraProps) => {
  const logout = useLogout().mutate;
  const { data } = useGetUser();
  const user = data?.data;
  const companyType = user?.company?.type;

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

          {(companyType === CompanyDTOTypeEnum.Supplier ||
            companyType === CompanyDTOTypeEnum.Manufacturer ||
            companyType === CompanyDTOTypeEnum.Retailer) && (
            <NavLink href='/products'>Products</NavLink>
          )}

          {(companyType === CompanyDTOTypeEnum.Manufacturer ||
            companyType === CompanyDTOTypeEnum.Retailer) && (
            <NavLink href='/commerce'>Commerce</NavLink>
          )}

          {(companyType === CompanyDTOTypeEnum.Retailer ||
            companyType === CompanyDTOTypeEnum.Manufacturer) && (
            <NavLink href='/inventory'>Inventory</NavLink>
          )}

          <NavLink href='/red-flags'>Red Flags</NavLink>

          {user?.role !== UserDTORoleEnum.Customer &&
            user?.role !== UserDTORoleEnum.Courier && (
              <NavLink href='/reports'>Reports</NavLink>
            )}

          {(companyType === CompanyDTOTypeEnum.Manufacturer ||
            companyType === CompanyDTOTypeEnum.Retailer) && (
            <NavLink href='/sales'>Sales</NavLink>
          )}

          {(companyType === CompanyDTOTypeEnum.Supplier ||
            companyType === CompanyDTOTypeEnum.Manufacturer ||
            companyType === CompanyDTOTypeEnum.Retailer) && (
            <NavLink href='/storage-facilities'>Storage Facilities</NavLink>
          )}

          {companyType === CompanyDTOTypeEnum.StorageFacility && (
            <NavLink href='/sellers'>Sellers</NavLink>
          )}

          {companyType !== CompanyDTOTypeEnum.StorageFacility && (
            <NavLink href='/orders'>Orders</NavLink>
          )}

          {companyType === CompanyDTOTypeEnum.Supplier && (
            <NavLink href='/ledger'>Ledger</NavLink>
          )}

          {companyType === CompanyDTOTypeEnum.StorageFacility && (
            <>
              <NavLink href='/returns'>Returns</NavLink>
              <NavLink href='/invoice'>Invoice</NavLink>
            </>
          )}

          <NavLink href='/map'>Map</NavLink>

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
            <Avatar mr='2' name={user?.username} src={user?.imageUrl} />
            <Text fontWeight='bold'>{user?.username}</Text>
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
