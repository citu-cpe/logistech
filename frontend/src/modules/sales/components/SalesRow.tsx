import { Text, Tr, Td } from '@chakra-ui/react';
import { Peso } from '../../../shared/components/Peso';

interface SalesRowProps {}

export const SalesRow: React.FC<SalesRowProps> = ({}) => {
  return (
    <Tr>
      <Td>Item A</Td>

      <Td>
        <Text></Text>
        <Text>Customer 1</Text>
        <Text>Customer 2</Text>
      </Td>

      <Td isNumeric>1</Td>

      <Td isNumeric>
        <Peso amount={1000} />
      </Td>

      <Td>Customer ID</Td>

      <Td>RFID</Td>

      <Td>Payment Status</Td>

      <Td>Delivery Status</Td>
    </Tr>
  );
};
