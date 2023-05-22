import { Flex, Box } from '@chakra-ui/react';
import { ProductItemDTOStatusEnum } from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { useGlobalStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';
import { StorageFacilityHomeChart } from './StorageFacilityHomeChart';

export const StorageFacility = () => {
  const flexBasis = { base: '40%', md: '30%' };
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetProductItemStatusQuantity(companyId);

  return (
    <Box>
      <Flex flexWrap='wrap' justify='center' rowGap='8' columnGap='8' mb='10'>
        {data?.data && (
          <>
            <LinkCard
              flexBasis={flexBasis}
              title='On Hold'
              n={data?.data.onHold}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.OnHold}`}
            />
            <LinkCard
              flexBasis={flexBasis}
              title='To Be Picked Up'
              n={data?.data.toBePickedUp}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.ToBePickedUp}`}
            />
            <LinkCard
              flexBasis={flexBasis}
              title='Orders'
              n={data?.data.orders}
              href='/orders'
            />
            <LinkCard
              flexBasis={flexBasis}
              title='In Transit To Storage Facility'
              n={data?.data.inTransitToStorageFacility}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToStorageFacility}`}
            />
            <LinkCard
              flexBasis={flexBasis}
              title='In Transit To Buyer'
              n={data?.data.inTransitToBuyer}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToBuyer}`}
            />
            <LinkCard
              flexBasis={flexBasis}
              title='Complete'
              n={data?.data.complete}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.Complete}`}
            />
            <LinkCard
              flexBasis={flexBasis}
              title='Cancelled'
              n={data?.data.canceled}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.Canceled}`}
            />
          </>
        )}
      </Flex>

      <StorageFacilityHomeChart />
    </Box>
  );
};
