import {
  Avatar,
  Box,
  Center,
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
import { CompanyTypeBadge } from '../CompanyTypeBadge';
import { NavLink } from './NavLink';

export const Navbar = (props: ChakraProps) => {
  const logout = useLogout().mutate;
  const { data } = useGetUser();
  const user = data?.data;
  const companyType = user?.company?.type;
  const isCustomer = user?.role === UserDTORoleEnum.Customer;
  const isCourier = user?.role === UserDTORoleEnum.Courier;
  const isBuyer =
    companyType === CompanyDTOTypeEnum.Retailer ||
    companyType === CompanyDTOTypeEnum.Manufacturer;
  const isSeller =
    companyType === CompanyDTOTypeEnum.Supplier ||
    companyType === CompanyDTOTypeEnum.Retailer ||
    companyType === CompanyDTOTypeEnum.Manufacturer;
  const isStorageFacility = companyType === CompanyDTOTypeEnum.StorageFacility;
  const isSupplier = companyType === CompanyDTOTypeEnum.Supplier;

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

          {isSeller && <NavLink href='/products'>Products</NavLink>}

          {(isCustomer || (isSeller && !isSupplier)) && (
            <NavLink href='/commerce'>Commerce</NavLink>
          )}

          {(isSeller || (isStorageFacility && !isCourier)) && (
            <NavLink href='/inventory'>Inventory</NavLink>
          )}

          {isSeller && !isSupplier && (
            <NavLink href='/complete-orders'>Complete Orders</NavLink>
          )}

          {!isCustomer && !isCourier && (
            <NavLink href='/red-flags'>Red Flags</NavLink>
          )}

          {!isCustomer && !isCourier && (
            <NavLink href='/reports'>Reports</NavLink>
          )}

          {isBuyer && <NavLink href='/sales'>Sales</NavLink>}

          {isSeller && (
            <NavLink href='/storage-facilities'>Storage Facilities</NavLink>
          )}

          {isStorageFacility && !isCourier && (
            <NavLink href='/sellers'>Sellers</NavLink>
          )}

          {!isStorageFacility && <NavLink href='/orders'>Orders</NavLink>}

          {companyType === CompanyDTOTypeEnum.Supplier && (
            <NavLink href='/ledger'>Ledger</NavLink>
          )}

          {(isSeller || (isStorageFacility && !isCourier)) && (
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
          <Box>
            <Flex align='center' gap='4'>
              <Avatar mr='2' name={user?.username} src={user?.imageUrl} />
              <Text fontWeight='bold'>{user?.username}</Text>
            </Flex>
            {companyType && (
              <Center mb='4'>
                <CompanyTypeBadge companyType={companyType} />
              </Center>
            )}
          </Box>
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
