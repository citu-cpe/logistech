import { Box, Center, Heading, Spinner } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  UserDTORoleEnum,
} from 'generated-api';
import { useRouter } from 'next/router';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { useGetProductItemsByStatusAndUser } from '../../modules/products/hooks/useGetProductItemsByStatusAndUser';
import { useGlobalStore } from '../../shared/stores';

const ProductItems = () => {
  const router = useRouter();
  const status = router.query.status as ProductItemByStatusDTOStatusEnum;
  const getUser = useGlobalStore((state) => state.getUser);
  const user = getUser();
  const isCustomer = user?.role === UserDTORoleEnum.Customer;
  const isCourier = user?.role === UserDTORoleEnum.Courier;
  const companyId = user?.company?.id;
  const { data, isLoading } = useGetProductItemsByStatus(companyId, status);
  const {
    data: customerProductItemsData,
    isLoading: customerProductItemsIsLoading,
  } = useGetProductItemsByStatusAndUser(status, isCustomer);

  const actualLoading = isCustomer ? customerProductItemsIsLoading : isLoading;
  const actualData = isCustomer ? customerProductItemsData : data;

  return (
    <Box>
      <Heading mb='6'>Products</Heading>

      {actualLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <ProductItemTable
          productItems={actualData?.data ?? []}
          allowActions={!isCustomer}
          isCustomer={isCustomer}
          isCourier={isCourier}
          status={status}
          isRfidOptional={false}
        />
      )}
    </Box>
  );
};

export default ProductItems;
