import { Box, Heading } from '@chakra-ui/react';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { ReturnsTable } from '../../modules/returns/components/ReturnsTable';
import { useGetCouriers } from '../../modules/storage-facilities/hooks/useGetCouriers';
import { useGlobalStore } from '../../shared/stores';

const Returns = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetProductItemsByStatus(
    companyId,
    ProductItemByStatusDTOStatusEnum.Returning
  );
  const productItems = data?.data;
  const couriersQuery = useGetCouriers(companyId);
  const couriers = couriersQuery.data?.data;

  return (
    !!productItems &&
    !!couriers && (
      <Box>
        <Heading>Returning</Heading>
        <ReturnsTable productItems={productItems} couriers={couriers} />
      </Box>
    )
  );
};

export default Returns;
