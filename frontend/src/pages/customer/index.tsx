import { Box, Heading } from '@chakra-ui/react';
import { CustomerTable } from '../../modules/customer/components/CustomerTable';

const Customer = () => {
  return (
    <Box>
      <Heading mb='6'>Customers</Heading>

      <CustomerTable />
    </Box>
  );
};

export default Customer;
