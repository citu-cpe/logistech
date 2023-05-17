import { Box, Flex } from '@chakra-ui/react';
import { ProductItemDTOStatusEnum } from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { useGlobalStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';

export interface CustomerProps {}

export const Customer: React.FC<CustomerProps> = () => {
  const flexBasis = { base: '40%', md: '25%' };
  const getUser = useGlobalStore((state) => state.getUser);
  const user = getUser();
  const { data } = useGetProductItemStatusQuantity(user?.id);

  return (
    <Box>
      {data?.data && (
        <Flex justify='center' mb='8' gap='14' flexWrap='wrap'>
          <LinkCard
            title='In Transit'
            n={data.data.inTransit}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransit}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='On Hold'
            n={data.data.onHold}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.OnHold}`}
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
            title='Returning'
            n={data.data.returning}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.Returning}`}
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
