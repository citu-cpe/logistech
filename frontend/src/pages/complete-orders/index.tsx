import { Box, Heading } from '@chakra-ui/react';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetOrderedProductItemsByStatus } from '../../modules/products/hooks/useGetOrderedProductItemsByStatus';
import { Spinner } from '../../shared/components/ui/Spinner';
import { useAuthStore } from '../../shared/stores';

const CompleteOrders = () => {
  const { companyId } = useAuthStore();
  const { data, isLoading } = useGetOrderedProductItemsByStatus(companyId, [
    ProductItemByStatusDTOStatusEnum.Complete,
    ProductItemByStatusDTOStatusEnum.ReturnRequested,
    ProductItemByStatusDTOStatusEnum.ReturnAccepted,
    ProductItemByStatusDTOStatusEnum.ReturnRejected,
  ]);
  const productItems = data?.data;

  return (
    <Box>
      <Heading mb='6'>Complete Orders</Heading>

      {isLoading || !productItems ? (
        <Spinner />
      ) : (
        <ProductItemTable
          productItems={productItems}
          isRfidOptional={false}
          allowReturn
        />
      )}
    </Box>
  );
};

export default CompleteOrders;
