import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { ProductItemDTO, ProductItemDTOStatusEnum } from 'generated-api';
import { useEffect, useState } from 'react';
import { ProductItemRow } from './ProductItemRow';

interface ProductItemTableProps {
  productItems: ProductItemDTO[];
  allowActions?: boolean;
  isCustomer?: boolean;
  allowReturn?: boolean;
  status?: ProductItemDTOStatusEnum;
  isCourier?: boolean;
  isRfidOptional: boolean;
}

export const ProductItemTable: React.FC<ProductItemTableProps> = ({
  productItems,
  allowActions,
  isCustomer,
  allowReturn,
  isCourier,
  isRfidOptional,
  status,
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

  const isComplete = status === ProductItemDTOStatusEnum.Complete;

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
            {(allowActions || allowReturn || isCourier || isComplete) && (
              <Th>Actions</Th>
            )}
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
              isRfidOptional={isRfidOptional}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
