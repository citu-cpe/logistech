import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
} from 'generated-api';
import { useEffect, useState } from 'react';
import { ProductItemRow } from './ProductItemRow';

interface ProductItemTableProps {
  productItems: ProductItemDTO[];
  allowActions?: boolean;
  isCustomer?: boolean;
  status?: ProductItemByStatusDTOStatusEnum;
  isCourier?: boolean;
  isRfidOptional: boolean;
}

export const ProductItemTable: React.FC<ProductItemTableProps> = ({
  productItems,
  allowActions,
  isCustomer,
  status,
  isCourier,
  isRfidOptional,
}) => {
  const [filteredProductItems, setFilteredProductItems] = useState<
    ProductItemDTO[]
  >([]);

  useEffect(() => {
    const actualProductItemRfids: string[] = [];
    const actualProductItems: ProductItemDTO[] = [];

    for (const p of productItems) {
      if (!!p.rfid && !actualProductItemRfids.includes(p.rfid)) {
        actualProductItems.push(p);
        actualProductItemRfids.push(p.rfid);
      } else if (!p.rfid) {
        actualProductItems.push(p);
      }
    }

    setFilteredProductItems(actualProductItems);
  }, [productItems]);

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>RFID</Th>
            <Th>Status</Th>
            <Th>Courier</Th>
            {isCourier && (
              <>
                <Th>Customer/Buyer Address</Th>
                <Th>Owning Company Address</Th>
                <Th>Owning Company Type</Th>
              </>
            )}
            {(allowActions ||
              (isCustomer &&
                status === ProductItemByStatusDTOStatusEnum.Complete) ||
              isCourier) && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {filteredProductItems.map((productItem) => (
            <ProductItemRow
              key={productItem.id}
              productItem={productItem}
              allowActions={allowActions}
              isCustomer={isCustomer}
              isCourier={isCourier}
              status={status}
              isRfidOptional={isRfidOptional}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
