import { Box, Heading } from '@chakra-ui/react';
import { SellersTable } from '../../modules/sellers/components/SellersTable';
import { useGetSellers } from '../../modules/sellers/hooks/useGetSellers';
import { useAuthStore } from '../../shared/stores';

const Sellers = () => {
  const { companyId } = useAuthStore();
  const sellersQuery = useGetSellers(companyId!);

  return (
    <Box>
      <Heading mb='6'>Sellers</Heading>

      <SellersTable sellers={sellersQuery?.data?.data ?? []} />
    </Box>
  );
};

export default Sellers;
