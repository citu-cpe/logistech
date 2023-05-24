import { useQueryClient } from "@tanstack/react-query";
import {
  CompanyDTOTypeEnum,
  CreateProductItemDTO,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ScanRfidDTO,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import {
  Flex,
  Button,
  Text,
  Box,
  useToast,
  Divider,
  FormControl,
  Input,
  Modal,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAxios } from "../hooks/useAxios";
import { COURIER_PRODUCT_ITEMS } from "../hooks/useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "../hooks/useGetProductsByStatusAndUser";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";
import { SocketContext } from "../providers/SocketProvider";

interface CourierProductItemProps {
  productItem: ProductItemDTO;
  onChangeStatus?: () => void;
  userId?: string;
}

export const CourierProductItemToBePickedUp: React.FC<
  CourierProductItemProps
> = ({ productItem, onChangeStatus, userId }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const socket = useContext(SocketContext);

  const isReturnAccepted =
    productItem.status === ProductItemDTOStatusEnum.ReturnAccepted;
  const isToBePickedUp =
    productItem.status === ProductItemDTOStatusEnum.ToBePickedUp;
  const isRetailerProduct =
    productItem.product?.company?.type === CompanyDTOTypeEnum.Retailer;
  const isInStorageFacility =
    productItem.status === ProductItemDTOStatusEnum.InStorageFacility;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductItemDTO>();
  const onSubmit: SubmitHandler<CreateProductItemDTO> = async (data) => {
    setIsLoading(true);
    await axios.put(`/product/product-item/${productItem.id}`, {
      status: UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility,
      rfid: data.rfid,
    });
    setIsLoading(false);
    queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
    queryClient.invalidateQueries(PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY);
    toast.show({
      title: "Updated product item",
      backgroundColor: "green.700",
      color: "green.50",
    });

    if (onChangeStatus) {
      onChangeStatus();
    }
  };

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on("scan", (dto: ScanRfidDTO) => {
        setValue("rfid", dto.rfid);
      });
    }
  }, [socket]);

  return (
    <Flex
      key={productItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      mb="2"
    >
      <Box>
        <Text color="white">EPC: {productItem.rfid ?? "n/a"}</Text>
        {productItem.customer && (
          <Text color="gray.400">
            Customer address: {productItem.customer.address}
          </Text>
        )}

        {productItem.buyer && (
          <Text color="gray.400">
            Buyer address: {productItem.buyer.address}
          </Text>
        )}

        {isReturnAccepted && productItem.product?.company && (
          <>
            <Divider my="2" />
            <Text color="gray.400">
              Company address: {productItem.product?.company?.address}
            </Text>
          </>
        )}
      </Box>

      <Button
        isLoading={updateProductItemStatus.isLoading || isLoading}
        onPress={async () => {
          if ((isToBePickedUp || isReturnAccepted) && isRetailerProduct) {
            setShowModal(true);
          } else {
            let status =
              UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility;

            if (isInStorageFacility) {
              status = UpdateProductItemStatusDTOStatusEnum.InTransitToBuyer;
            } else if (isToBePickedUp) {
              status =
                UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility;
            }

            setIsLoading(true);
            await axios.patch(
              `/product/product-item/${productItem.id}/status`,
              {
                status,
              }
            );
            setIsLoading(false);
            queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
            queryClient.invalidateQueries(
              PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY
            );
            toast.show({
              title: "Updated product item",
              backgroundColor: "green.700",
              color: "green.50",
            });

            if (onChangeStatus) {
              onChangeStatus();
            }
          }
        }}
        isDisabled={
          (productItem.status === ProductItemDTOStatusEnum.ToBePickedUp ||
            productItem.status === ProductItemDTOStatusEnum.InStorageFacility ||
            productItem.status === ProductItemDTOStatusEnum.ReturnAccepted) &&
          productItem.courier?.id !== userId
        }
      >
        Accept
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px" marginBottom="auto" mt="16">
          <Modal.CloseButton />
          <Modal.Header>Assign RFID to Product Item</Modal.Header>
          <Modal.Body>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.rfid} mb={5} isDisabled>
                  <FormControl.Label>
                    <Text>EPC (Electronic Product Code)</Text>
                  </FormControl.Label>
                  <Input
                    variant="outline"
                    p={2}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    autoCapitalize="none"
                    isDisabled
                  />
                  <FormControl.ErrorMessage>
                    {errors.rfid?.type === "required" && "EPC is required"}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
              name="rfid"
              rules={{ required: true }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button isLoading={isLoading} onPress={handleSubmit(onSubmit)}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Flex>
  );
};
