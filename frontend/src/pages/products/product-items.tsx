import { Box, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ProductItemLocationDTO,
  UserDTORoleEnum,
} from 'generated-api';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { useGetProductItemsByStatusAndUser } from '../../modules/products/hooks/useGetProductItemsByStatusAndUser';
import { ProductItemStatusBadge } from '../../shared/components/ProductItemStatusBadge';
import { SocketContext } from '../../shared/providers/SocketProvider';
import { useAuthStore } from '../../shared/stores';

const ProductItems = () => {
  const router = useRouter();
  const status = router.query.status as ProductItemByStatusDTOStatusEnum;
  const { user, companyId } = useAuthStore();
  const isCustomer = user?.role === UserDTORoleEnum.Customer;
  const isCourier = user?.role === UserDTORoleEnum.Courier;
  const { data, isLoading } = useGetProductItemsByStatus(
    companyId,
    status,
    (responseData) => {
      const actualDataRfids = responseData.data.map((p) => p.rfid);
      const actualProductItemRfids: string[] = [];
      const actualProductItems: ProductItemDTO[] = [];

      const filteredProductItems = productItems.filter((p) =>
        actualDataRfids?.includes(p.rfid)
      );

      for (const p of filteredProductItems) {
        if (!!p.rfid && !actualProductItemRfids.includes(p.rfid)) {
          actualProductItems.push(p);
          actualProductItemRfids.push(p.rfid);
        } else if (!p.rfid) {
          actualProductItems.push(p);
        }
      }

      setProductItems(actualProductItems);
    }
  );
  const {
    data: customerProductItemsData,
    isLoading: customerProductItemsIsLoading,
  } = useGetProductItemsByStatusAndUser(status, isCustomer);

  const actualLoading = isCustomer ? customerProductItemsIsLoading : isLoading;
  let actualData = (isCustomer ? customerProductItemsData : data)?.data;
  const socket = useContext(SocketContext);
  const [productItems, setProductItems] = useState<ProductItemDTO[]>([]);
  const [redFlagIds, setRedFlagIds] = useState<string[]>([]);

  if (
    isCourier &&
    (status === ProductItemByStatusDTOStatusEnum.InTransitToStorageFacility ||
      status === ProductItemByStatusDTOStatusEnum.InTransitToBuyer ||
      status === ProductItemByStatusDTOStatusEnum.InTransitToSeller)
  ) {
    actualData = productItems;
  }

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
            .filter((p) => dto.missingTags.split(',').includes(p.rfid!))
            .map((p) => p.rfid!)
        );
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
          status={status as unknown as ProductItemDTOStatusEnum}
          isRfidOptional={false}
          redFlagIds={redFlagIds}
        />
      )}
    </Box>
  );
};

export default ProductItems;
