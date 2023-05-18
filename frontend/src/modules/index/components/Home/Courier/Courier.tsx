import { Box, Flex } from '@chakra-ui/react';
import { ProductItemDTOStatusEnum } from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { useGlobalStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';

export interface CourierProps {}

export const Courier: React.FC<CourierProps> = () => {
  const flexBasis = { base: '40%', md: '25%' };
  const getUser = useGlobalStore((state) => state.getUser);
  const user = getUser();
  const companyId = user?.company?.id;
  const { data } = useGetProductItemStatusQuantity(companyId);

  return (
    <Box>
      {data?.data && (
        <Flex justify='center' mb='8' gap='14' flexWrap='wrap'>
          <LinkCard
            title='To Be Picked Up'
            n={data.data.toBePickedUp}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.ToBePickedUp}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Current Delivery'
            n={data.data.inTransit}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransit}`}
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Returning'
            n={data.data.returning}
            href={`/products/product-items?status=${ProductItemDTOStatusEnum.Returning}`}
            flexBasis={flexBasis}
          />
        </Flex>
      )}
    </Box>
  );
};
