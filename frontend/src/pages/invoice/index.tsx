import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useGetPaidOrdersForStorageFacility } from '../../modules/orders/hooks/useGetPaidOrdersForStorageFacility';
import { useGlobalStore } from '../../shared/stores';
import { addLeadingZeros } from '../../shared/utils/addLeadingZeros';
import NextLink from 'next/link';

const Invoice = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const { data } = useGetPaidOrdersForStorageFacility(companyId);
  const orders = data?.data;

  return (
    <Box>
      <Heading mb='6'>Invoice</Heading>

      <Box>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Invoice Number</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((o) => (
                <Tr key={o.id}>
                  <Td>
                    <NextLink href={`/invoice/${o.id}`}>
                      {addLeadingZeros(o.invoiceNumber, 4)}
                    </NextLink>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Invoice;
