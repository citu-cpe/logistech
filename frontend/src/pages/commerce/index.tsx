import { Box, Flex } from '@chakra-ui/react';
import {
  CommerceProductDTOCompanyTypesEnum,
  CompanyDTOTypeEnum,
} from 'generated-api';
import { ItemCard } from '../../modules/commerce/components/ItemCard';
import { useGetCommerceProducts } from '../../modules/commerce/hooks/useGetCommerceProducts';
import { useGlobalStore } from '../../shared/stores';

const getCompanyTypes = (companyType: CompanyDTOTypeEnum) => {
  switch (companyType) {
    case CompanyDTOTypeEnum.Manufacturer:
      return [CommerceProductDTOCompanyTypesEnum.Supplier];
    case CompanyDTOTypeEnum.Retailer:
      return [
        CommerceProductDTOCompanyTypesEnum.Supplier,
        CommerceProductDTOCompanyTypesEnum.Manufacturer,
        CommerceProductDTOCompanyTypesEnum.Retailer,
      ];
    default:
      return [];
  }
};

const Commerce = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const companyType = getUser()?.company?.type;
  const { data } = useGetCommerceProducts(
    getCompanyTypes(companyType!),
    companyId!
  );

  return (
    <Box>
      {companyId && (
        <Flex flexWrap='wrap' gap='6'>
          {data?.data.map((product) => (
            <ItemCard
              key={product.id}
              product={product}
              companyId={companyId}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Commerce;
