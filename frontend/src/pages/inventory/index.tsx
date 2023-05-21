import { Box, Center, Heading, Spinner } from '@chakra-ui/react';
import { ProductItemDTO, ScanRfidDTO } from 'generated-api';
import { useContext, useEffect, useState } from 'react';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByCompany } from '../../modules/products/hooks/useGetProductItemsByCompany';
import { SocketContext } from '../../shared/providers/SocketProvider';
import { useGlobalStore } from '../../shared/stores';

const Inventory = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const { data, isLoading } = useGetProductItemsByCompany(companyId);
  const socket = useContext(SocketContext);
  const [productItems, setProductItems] = useState<ProductItemDTO[]>([]);

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.open();
      }

      socket.on('scan', (dto: ScanRfidDTO) => {
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
      });
    }

    return () => {
      socket?.close();
    };
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
        />
      )}
    </Box>
  );
};

export default Inventory;
