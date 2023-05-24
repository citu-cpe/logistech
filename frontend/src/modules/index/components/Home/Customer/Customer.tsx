import { Box, Flex } from '@chakra-ui/react';
import { ProductItemDTOStatusEnum } from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { useAuthStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';

export interface CustomerProps {}

export const Customer: React.FC<CustomerProps> = () => {
  const flexBasis = { base: '40%', md: '25%' };
  const { userId } = useAuthStore();
  const { data } = useGetProductItemStatusQuantity(userId);

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
            title='In Transit To Storage Facility'
            n={data.data.inTransitToStorageFacility}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToStorageFacility}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='In Storage Facility'
            n={data.data.inStorageFacility}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InStorageFacility}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='In Transit To Me'
            n={data.data.inTransitToBuyer}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToBuyer}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Complete'
            n={data.data.complete}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.Complete}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Red Flag'
            n={data.data.redFlag}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.RedFlag}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Return Requested'
            n={data.data.returnRequested}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.ReturnRequested}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Return Accepted'
            n={data.data.returnAccepted}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.ReturnAccepted}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Return Rejected'
            n={data.data.returnRejected}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.ReturnRejected}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Returned'
            n={data.data.returned}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.Returned}`}
            flexBasis={flexBasis}
          />
        </Flex>
      )}
    </Box>
  );
};
