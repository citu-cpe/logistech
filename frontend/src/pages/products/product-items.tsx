import { Box, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ScanRfidDTO,
  UserDTORoleEnum,
} from 'generated-api';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { useGetProductItemsByStatusAndUser } from '../../modules/products/hooks/useGetProductItemsByStatusAndUser';
import { ProductItemStatusBadge } from '../../shared/components/ProductItemStatusBadge';
import { SocketContext } from '../../shared/providers/SocketProvider';
import { useGlobalStore } from '../../shared/stores';

const ProductItems = () => {
  const router = useRouter();
  const status = router.query.status as ProductItemByStatusDTOStatusEnum;
  const getUser = useGlobalStore((state) => state.getUser);
  const user = getUser();
  const isCustomer = user?.role === UserDTORoleEnum.Customer;
  const isCourier = user?.role === UserDTORoleEnum.Courier;
  const companyId = user?.company?.id;
  const { data, isLoading } = useGetProductItemsByStatus(companyId, status);
  const {
    data: customerProductItemsData,
    isLoading: customerProductItemsIsLoading,
  } = useGetProductItemsByStatusAndUser(status, isCustomer);

  const actualLoading = isCustomer ? customerProductItemsIsLoading : isLoading;
  const actualData = (isCustomer ? customerProductItemsData : data)?.data;
  const socket = useContext(SocketContext);
  const [productItems, setProductItems] = useState<ProductItemDTO[]>([]);

  // TODO: revert
  // if (
  //   isCourier &&
  //   (status === ProductItemByStatusDTOStatusEnum.InTransitToStorageFacility ||
  //     status === ProductItemByStatusDTOStatusEnum.InTransitToBuyer)
  // ) {
  //   actualData = productItems;
  // }

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
  });

  return (
    <Box>
      <Flex alignItems='center'>
        <Heading mb='6' mr='2'>
          Products
        </Heading>
        {status && (
          <ProductItemStatusBadge
            status={status as unknown as ProductItemDTOStatusEnum}
          />
        )}
      </Flex>

      {actualLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <ProductItemTable
          productItems={actualData ?? []}
          allowActions={!isCustomer}
          isCustomer={isCustomer}
          isCourier={isCourier}
          status={status}
          isRfidOptional={false}
        />
      )}
    </Box>
  );
};

export default ProductItems;
