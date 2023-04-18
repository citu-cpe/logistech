import { Box, Heading } from '@chakra-ui/react';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useRouter } from 'next/router';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { useGlobalStore } from '../../shared/stores';

const ProductItems = () => {
  const router = useRouter();
  const status = router.query.status as ProductItemByStatusDTOStatusEnum;
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetProductItemsByStatus(companyId, status);

  return (
    <Box>
      <Heading mb='6'>Products</Heading>

      <ProductItemTable productItems={data?.data ?? []} allowActions />
    </Box>
  );
};

export default ProductItems;