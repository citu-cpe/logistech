import { Box, Heading } from '@chakra-ui/react';
import { SalesTable } from '../../modules/sales/components/SalesTable';

const Sales = () => {
  return (
    <Box>
      <Heading mb='6'>Sales</Heading>
      <SalesTable />
    </Box>
  );
};

export default Sales;
