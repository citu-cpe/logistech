import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import {
  CommerceProductDTOCompanyTypesEnum,
  CompanyDTOTypeEnum,
  UserDTORoleEnum,
} from 'generated-api';
import { ItemCard } from '../../modules/commerce/components/ItemCard';
import { useGetCommerceProducts } from '../../modules/commerce/hooks/useGetCommerceProducts';
import { useGlobalStore } from '../../shared/stores';

const getCompanyTypes = (
  companyType: CompanyDTOTypeEnum,
  userRole?: UserDTORoleEnum
) => {
  if (userRole && userRole === UserDTORoleEnum.Customer) {
    return [
      CommerceProductDTOCompanyTypesEnum.Manufacturer,
      CommerceProductDTOCompanyTypesEnum.Retailer,
    ];
  }
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
  const user = getUser();
  const companyId = getUser()?.company?.id;
  const companyType = getUser()?.company?.type;
  const { data, isLoading } = useGetCommerceProducts(
    getCompanyTypes(companyType!, user?.role),
    companyId! ?? user?.id
  );

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Box>
      {(user?.role === UserDTORoleEnum.Customer || companyId) && (
        <Flex flexWrap='wrap' gap='6'>
          {data?.data.map((product) => (
            <ItemCard
              key={product.id}
              product={product}
              companyId={companyId}
              userRole={user?.role}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Commerce;
