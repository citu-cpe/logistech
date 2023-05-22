import { useQueryClient } from "@tanstack/react-query";
import {
  CompanyDTOTypeEnum,
  CreateProductItemDTO,
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
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
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAxios } from "../hooks/useAxios";
import { COURIER_PRODUCT_ITEMS } from "../hooks/useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "../hooks/useGetProductsByStatusAndUser";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";

interface CourierProductItemProps {
  productItem: ProductItemDTO;
  onChangeStatus?: () => void;
}

export const CourierProductItemToBePickedUp: React.FC<
  CourierProductItemProps
> = ({ productItem, onChangeStatus }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const isReturning = productItem.status === ProductItemDTOStatusEnum.Returning;
  const isToBePickedUp =
    productItem.status === ProductItemDTOStatusEnum.ToBePickedUp;
  const isRetailerProduct =
    productItem.product?.company?.type === CompanyDTOTypeEnum.Retailer;
  const {
    control,
    handleSubmit,
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
    queryClient.invalidateQueries(
      PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
        ProductItemByStatusDTOStatusEnum.Complete
      )
    );
    toast.show({
      title: "Updated product item",
      backgroundColor: "green.700",
      color: "green.50",
    });

    if (onChangeStatus) {
      onChangeStatus();
    }
  };

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

        {isReturning && productItem.product?.company && (
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
          if ((isToBePickedUp || isReturning) && isRetailerProduct) {
            setShowModal(true);
          } else {
            setIsLoading(true);
            await axios.patch(
              `/product/product-item/${productItem.id}/status`,
              {
                status:
                  UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility,
              }
            );
            setIsLoading(false);
            queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
            queryClient.invalidateQueries(
              PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
                ProductItemByStatusDTOStatusEnum.Complete
              )
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
                <FormControl isInvalid={!!errors.rfid} mb={5}>
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
                  />
                  <FormControl.ErrorMessage>
                    {errors.rfid?.type === "required" && "Email is required"}
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
