import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { ProductItemDTO } from 'generated-api';
import { ProductItemRow } from './ProductItemRow';

interface ProductItemTableProps {
  productItems: ProductItemDTO[];
  allowActions?: boolean;
}

export const ProductItemTable: React.FC<ProductItemTableProps> = ({
  productItems,
  allowActions,
}) => {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>RFID</Th>
            <Th>Status</Th>
            {allowActions && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {productItems.map((productItem) => (
            <ProductItemRow
              key={productItem.id}
              productItem={productItem}
              allowActions={allowActions}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
