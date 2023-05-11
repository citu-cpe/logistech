import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StatusList } from '../../../../../shared/components/StatusList';
import { useGlobalStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';
import { ManufacturerHomeChart } from './ManufacturerHomeChart';

export const Manufacturer = () => {
  const flexBasis = { base: '40%', md: '25%' };
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetProductItemStatusQuantity(companyId);

  return (
    <Box>
      <Flex gap='4' mb='8'>
        <Button colorScheme='gray' textTransform='uppercase'>
          Book
        </Button>
        <Button colorScheme='gray' textTransform='uppercase'>
          Invoice
        </Button>
        <Button colorScheme='gray' textTransform='uppercase'>
          Customer
        </Button>
      </Flex>

      {data?.data && (
        <Flex justify='center' mb='8' gap='14' flexWrap='wrap'>
          <LinkCard
            title='On Hold'
            n={data.data.onHold}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.OnHold}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='To Be Picked Up'
            n={data.data.toBePickedUp}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.ToBePickedUp}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='In Transit'
            n={data.data.inTransit}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransit}`}
            flexBasis={flexBasis}
          />
        </Flex>
      )}

      <Flex gap='4' h='sm' align='stretch' flexWrap='wrap'>
        <ManufacturerHomeChart flexBasis={{ base: '100%', md: '65%' }} />

        <Box rounded='md' backgroundColor='gray.700' p='6' flexGrow='1'>
          <Heading size='md' textAlign='center' mb='4'>
            Return Handling
          </Heading>

          <StatusList status={ProductItemByStatusDTOStatusEnum.Returned} />
        </Box>
      </Flex>
    </Box>
  );
};
