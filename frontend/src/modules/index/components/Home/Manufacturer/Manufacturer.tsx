import { Box, Flex, Heading } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StatusList } from '../../../../../shared/components/StatusList';
import { useAuthStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';
import { ManufacturerHomeChart } from './ManufacturerHomeChart';

export const Manufacturer = () => {
  const flexBasis = { base: '40%', md: '25%' };
  const { companyId } = useAuthStore();
  const { data } = useGetProductItemStatusQuantity(companyId);

  return (
    <Box>
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
            title='In Transit To Storage Facility'
            n={data.data.inTransitToStorageFacility}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToStorageFacility}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='In Transit To Buyer'
            n={data.data.inTransitToBuyer}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToBuyer}`}
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
