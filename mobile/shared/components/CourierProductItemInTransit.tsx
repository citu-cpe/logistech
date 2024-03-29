import { useQueryClient } from "@tanstack/react-query";
import {
  CreateProductItemDTO,
  ProductItemDTO,
  ProductItemLocationDTO,
  ScanRfidDTO,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import { ProductItemDTOStatusEnum } from "generated-api/dist/models/product-item-dto";
import {
  Flex,
  Button,
  Text,
  Box,
  useToast,
  FormControl,
  Input,
  Modal,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAxios } from "../hooks/useAxios";
import { COURIER_PRODUCT_ITEMS } from "../hooks/useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "../hooks/useGetProductsByStatusAndUser";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";
import { SocketContext } from "../providers/SocketProvider";

interface CourierProductItemInTransit {
  productItem: ProductItemDTO;
  onChangeStatus?: () => void;
  isRedFlag?: boolean;
}

export const CourierProductItemInTransit: React.FC<
  CourierProductItemInTransit
> = ({ productItem, onChangeStatus, isRedFlag }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxios();
  const [showModal, setShowModal] = useState(false);
  const socket = useContext(SocketContext);

  const isReturnAccepted =
    productItem.status === ProductItemDTOStatusEnum.ReturnAccepted;
  const isInTransitToStorageFacility =
    productItem.status === ProductItemDTOStatusEnum.InTransitToStorageFacility;
  const isInTransitToBuyer =
    productItem.status === ProductItemDTOStatusEnum.InTransitToBuyer;
  const isInTransitToSeller =
    productItem.status === ProductItemDTOStatusEnum.InTransitToSeller;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductItemDTO>();
  const onSubmit: SubmitHandler<CreateProductItemDTO> = async (data) => {
    setIsLoading(true);
    await axios.put(`/product/product-item/${productItem.id}`, {
      status: UpdateProductItemStatusDTOStatusEnum.InTransitToSeller,
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

      socket.on("test", (dto: ProductItemLocationDTO) => {
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
      bg={isRedFlag ? "red.500" : ""}
    >
      <Box flexBasis="50%">
        <Text color="white">EPC: {productItem.rfid ?? "n/a"}</Text>

        {productItem.customer && (
          <Text color="gray.400">
            Customer address: {productItem.customer?.address}
          </Text>
        )}

        {productItem.buyer && (
          <Text color="gray.400">
            Buyer address: {productItem.buyer.address}
          </Text>
        )}

        {isReturnAccepted && productItem.product?.company && (
          <Text color="gray.400">
            Company address: {productItem.product?.company?.address}
          </Text>
        )}
      </Box>

      <Button
        isLoading={updateProductItemStatus.isLoading || isLoading}
        onPress={async () => {
          if (isReturnAccepted) {
            setShowModal(true);
          } else {
            setIsLoading(true);
            let status = UpdateProductItemStatusDTOStatusEnum.Complete;

            if (isReturnAccepted) {
              status = UpdateProductItemStatusDTOStatusEnum.InTransitToSeller;
            } else if (isInTransitToSeller) {
              status = UpdateProductItemStatusDTOStatusEnum.Returned;
            } else if (isInTransitToStorageFacility) {
              status = UpdateProductItemStatusDTOStatusEnum.InStorageFacility;
            } else if (isInTransitToBuyer) {
              status = UpdateProductItemStatusDTOStatusEnum.Complete;
            }

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
          }
        }}
      >
        {isReturnAccepted && <Text color="white">Accept</Text>}
        {isInTransitToStorageFacility && (
          <Text color="white">Set In Storage Facility</Text>
        )}
        {isInTransitToBuyer && <Text color="white">Complete</Text>}
        {isInTransitToSeller && <Text color="white">Return</Text>}
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
