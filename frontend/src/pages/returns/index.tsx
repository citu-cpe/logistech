import { Box, Heading } from '@chakra-ui/react';
import {
  CompanyDTOTypeEnum,
  ProductItemByStatusDTOStatusEnum,
} from 'generated-api';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { ReturnsTable } from '../../modules/returns/components/ReturnsTable';
import { useGetCouriers } from '../../modules/storage-facilities/hooks/useGetCouriers';
import { useAuthStore } from '../../shared/stores';

const Returns = () => {
  const { companyId, companyType } = useAuthStore();
  const isStorageFacility = companyType === CompanyDTOTypeEnum.StorageFacility;
  const { data } = useGetProductItemsByStatus(
    companyId,
    isStorageFacility
      ? ProductItemByStatusDTOStatusEnum.ReturnAccepted
      : ProductItemByStatusDTOStatusEnum.ReturnRequested
  );
  const productItems = data?.data;
  const couriersQuery = useGetCouriers(companyId);
  const couriers = couriersQuery.data?.data;

  return (
    !!productItems &&
    !!couriers && (
      <Box>
        <Heading>Returns</Heading>
        <ReturnsTable
          productItems={productItems}
          couriers={couriers}
          isStorageFacility={isStorageFacility}
        />
      </Box>
    )
  );
};

export default Returns;
