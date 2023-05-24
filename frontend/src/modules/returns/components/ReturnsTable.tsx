import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { ProductItemDTO, UserDTO } from 'generated-api';
import { ReturnsRow } from './ReturnsRow';

export interface ReturnsTableProps {
  productItems: ProductItemDTO[];
  couriers: UserDTO[];
  isStorageFacility: boolean;
}

export const ReturnsTable: React.FC<ReturnsTableProps> = ({
  productItems,
  couriers,
  isStorageFacility,
}) => {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>RFID</Th>
            <Th>Status</Th>
            <Th>Customer</Th>
            <Th>Courier</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productItems.map((productItem) => (
            <ReturnsRow
              key={productItem.id}
              productItem={productItem}
              couriers={couriers}
              isStorageFacility={isStorageFacility}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
