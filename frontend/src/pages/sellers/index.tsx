import { Box, Heading } from '@chakra-ui/react';
import { SellersTable } from '../../modules/sellers/components/SellersTable';
import { useGetSellers } from '../../modules/sellers/hooks/useGetSellers';
import { useGlobalStore } from '../../shared/stores';

const Sellers = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const sellersQuery = useGetSellers(companyId!);

  return (
    <Box>
      <Heading mb='6'>Storage Facilities</Heading>

      <SellersTable sellers={sellersQuery?.data?.data ?? []} />
    </Box>
  );
};

export default Sellers;
