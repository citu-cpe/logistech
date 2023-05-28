import { Box, Center, Heading, Spinner } from '@chakra-ui/react';
import { ProductItemDTO, ProductItemLocationDTO } from 'generated-api';
import { useContext, useEffect, useState } from 'react';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByCompany } from '../../modules/products/hooks/useGetProductItemsByCompany';
import { SocketContext } from '../../shared/providers/SocketProvider';
import { useAuthStore } from '../../shared/stores';

const Inventory = () => {
  const { companyId } = useAuthStore();
  const { data, isLoading } = useGetProductItemsByCompany(
    companyId,
    (responseData) => {
      const actualDataRfids = responseData.data.map((p) => p.rfid);
      const actualProductItemRfids: string[] = [];
      const actualProductItems: ProductItemDTO[] = [];

      const filteredProductItems = productItems.filter((p) =>
        actualDataRfids?.includes(p.rfid)
      );

      for (const p of filteredProductItems) {
        if (!!p.rfid && !actualProductItemRfids.includes(p.rfid)) {
          const foundPi = responseData.data.find((pi) => pi.rfid === p.rfid);
          if (foundPi) {
            actualProductItems.push(foundPi);
            actualProductItemRfids.push(p.rfid);
          }
        } else if (!p.rfid) {
          actualProductItems.push(p);
        }
      }

      setProductItems(actualProductItems);
    }
  );
  const socket = useContext(SocketContext);
  const [productItems, setProductItems] = useState<ProductItemDTO[]>([]);
  const [redFlagIds, setRedFlagIds] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.open();
      }

      socket.on('test', (dto: ProductItemLocationDTO) => {
        const dataRfIds = data?.data.map((p) => p.rfid);
        const productItemsRfids = productItems.map((p) => p.rfid);

        if (
          dataRfIds?.includes(dto.rfid) &&
          !productItemsRfids.includes(dto.rfid)
        ) {
          const productItem = data?.data.find((p) => p.rfid === dto.rfid);
          if (productItem) {
            setProductItems((prevProductItems) => {
              return [...prevProductItems, productItem];
            });
          }
        }

        setRedFlagIds(
          productItems
            .filter((p) => !!p.rfid)
            .filter((p) =>
              dto.missingTags
                .split(',')
                .map((rfid) => rfid.toUpperCase())
                .includes(p.rfid!)
            )
            .map((p) => p.rfid!)
        );
      });
    }
  }, [socket, data, productItems]);

  return (
    <Box>
      <Heading>Inventory</Heading>

      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <ProductItemTable
          productItems={productItems ?? []}
          allowActions={true}
          isCustomer={false}
          isCourier={false}
          isRfidOptional={false}
          redFlagIds={redFlagIds}
        />
      )}
    </Box>
  );
};

export default Inventory;
