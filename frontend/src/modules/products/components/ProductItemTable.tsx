import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
} from 'generated-api';
import { ProductItemRow } from './ProductItemRow';

interface ProductItemTableProps {
  productItems: ProductItemDTO[];
  allowActions?: boolean;
  isCustomer?: boolean;
  status?: ProductItemByStatusDTOStatusEnum;
}

export const ProductItemTable: React.FC<ProductItemTableProps> = ({
  productItems,
  allowActions,
  isCustomer,
  status,
}) => {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>RFID</Th>
            <Th>Status</Th>
            {allowActions ||
              (isCustomer &&
                status === ProductItemByStatusDTOStatusEnum.Complete && (
                  <Th>Actions</Th>
                ))}
          </Tr>
        </Thead>
        <Tbody>
          {productItems.map((productItem) => (
            <ProductItemRow
              key={productItem.id}
              productItem={productItem}
              allowActions={allowActions}
              isCustomer={isCustomer}
              status={status}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
