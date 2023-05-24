import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { SupplierHomeChart } from './SupplierHomeChart';
import NextLink from 'next/link';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useAuthStore } from '../../../../../shared/stores';
import { useGetTopTenProducts } from '../../../hooks/useGetTopTenProducts';

export const Supplier = () => {
  const { companyId } = useAuthStore();
  const { data } = useGetTopTenProducts(companyId);

  return (
    <Box>
      <SupplierHomeChart />

      <Box borderRadius='md' py='6' backgroundColor='gray.700'>
        <Flex
          flexWrap='wrap'
          justify={{ base: 'center', md: 'space-between' }}
          rowGap='6'
          borderColor='gray.900'
          mb='10'
        >
          {data?.data.map((p) => (
            <Flex
              key={p.id}
              direction='column'
              align='center'
              flexBasis={{ base: '30%', md: '21%' }}
            >
              <Flex
                justify='center'
                align='center'
                w={{ base: '16', md: '20' }}
                h={{ base: '16', md: '20' }}
                textAlign='center'
                backgroundColor='gray.800'
                borderRadius='md'
                mb='2'
              >
                <Text fontSize={{ base: '2xl', md: '4xl' }}>X</Text>
              </Flex>
              <Text fontSize={{ base: 'sm', md: 'lg' }}>{p.name}</Text>
            </Flex>
          ))}
        </Flex>

        <Flex justify='space-around' flexWrap='wrap' rowGap='6'>
          <NextLink
            href={`/products/product-items?status=${ProductItemByStatusDTOStatusEnum.OnHold}`}
          >
            <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
              On hold
            </Button>
          </NextLink>

          <NextLink
            href={`/products/product-items?status=${ProductItemByStatusDTOStatusEnum.InTransitToStorageFacility}`}
          >
            <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
              In Transit To Storage Facility
            </Button>
          </NextLink>

          <NextLink
            href={`/products/product-items?status=${ProductItemByStatusDTOStatusEnum.InTransitToBuyer}`}
          >
            <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
              In Transit To Buyer
            </Button>
          </NextLink>

          <NextLink
            href={`/products/product-items?status=${ProductItemByStatusDTOStatusEnum.InStorage}`}
          >
            <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
              In Storage
            </Button>
          </NextLink>

          <NextLink href={'/customer'}>
            <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
              Customers
            </Button>
          </NextLink>
        </Flex>
      </Box>
    </Box>
  );
};
