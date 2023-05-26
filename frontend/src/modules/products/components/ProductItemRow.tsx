import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Tr,
  Td,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import {
  CompanyDTOTypeEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  UpdateProductItemStatusDTOStatusEnum,
} from 'generated-api';
import { CompanyTypeBadge } from '../../../shared/components/CompanyTypeBadge';
import { ProductItemStatusBadge } from '../../../shared/components/ProductItemStatusBadge';
import { useAuthStore } from '../../../shared/stores';
import { useDeleteProductItem } from '../hooks/useDeleteProductItem';
import { useUpdateProductItemStatus } from '../hooks/useUpdateProductItemStatus';
import { EditProductItemForm } from './EditProductItemForm';

interface ProductItemRowProps {
  productItem: ProductItemDTO;
  productId?: string;
  allowActions?: boolean;
  isCustomer?: boolean;
  isCourier?: boolean;
  isRfidOptional: boolean;
  isRedFlag?: boolean;
}

export const ProductItemRow: React.FC<ProductItemRowProps> = ({
  productItem,
  allowActions,
  isCustomer,
  isCourier,
  isRfidOptional,
  isRedFlag,
}) => {
  const { userId, companyId } = useAuthStore();
  const {
    isOpen: isEditProductItemOpen,
    onOpen: onEditProductItemOpen,
    onClose: onEditProductItemClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteProductItemOpen,
    onOpen: onDeleteProductItemOpen,
    onClose: onDeleteProductItemClose,
  } = useDisclosure();
  const deleteProductItemMutation = useDeleteProductItem();

  const deleteProductItem = () => {
    deleteProductItemMutation.mutate(productItem.id, {
      onSettled: () => {
        onDeleteProductItemClose();
      },
    });
  };
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const isReturnAccepted =
    productItem.status === ProductItemDTOStatusEnum.ReturnAccepted;
  const isInTransitToStorageFacility =
    productItem.status === ProductItemDTOStatusEnum.InTransitToStorageFacility;
  const isInStorageFacility =
    productItem.status === ProductItemDTOStatusEnum.InStorageFacility;
  const isInTransitToBuyer =
    productItem.status === ProductItemDTOStatusEnum.InTransitToBuyer;
  const isInTransitToSeller =
    productItem.status === ProductItemDTOStatusEnum.InTransitToSeller;
  const isToBePickedUp =
    productItem.status === ProductItemDTOStatusEnum.ToBePickedUp;
  const isToBeInTransit =
    isToBePickedUp || isInStorageFacility || isReturnAccepted;
  const isAcceptDisabled =
    isCourier && isToBeInTransit && productItem.courier?.id !== userId;
  const isInStorage = productItem.status === ProductItemDTOStatusEnum.InStorage;

  return (
    <Tr key={productItem.id} bg={isRedFlag ? 'red.500' : ''}>
      <Td>{productItem.rfid ?? 'n/a'}</Td>
      <Td>
        <ProductItemStatusBadge status={productItem.status} />
      </Td>
      <Td>{productItem.courier?.username}</Td>

      {isCourier && (
        <>
          <Td>{productItem.customer?.address ?? productItem.buyer?.address}</Td>
          <Td>{productItem.product?.company?.address}</Td>
          {productItem.product?.company?.type && (
            <Td>
              <CompanyTypeBadge
                companyType={productItem.product.company.type}
              />
            </Td>
          )}
        </>
      )}

      <Td>
        {productItem.status === ProductItemDTOStatusEnum.Complete &&
          productItem.buyer?.id === companyId && (
            <Button
              isLoading={updateProductItemStatus.isLoading}
              onClick={() => {
                updateProductItemStatus.mutate({
                  status: UpdateProductItemStatusDTOStatusEnum.ReturnRequested,
                });
              }}
            >
              Request Return
            </Button>
          )}

        {isCourier && (
          <Tooltip
            label={isAcceptDisabled && 'Product item is not assigned to you'}
          >
            <Button
              isLoading={updateProductItemStatus.isLoading}
              onClick={() => {
                let productItemStatus =
                  UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility;

                if (
                  (isToBePickedUp || isReturnAccepted) &&
                  productItem.product?.company?.type ===
                    CompanyDTOTypeEnum.Retailer
                ) {
                  onEditProductItemOpen();
                } else {
                  if (isReturnAccepted) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.InTransitToSeller;
                  } else if (isInTransitToSeller) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.Returned;
                  } else if (isInTransitToStorageFacility) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.InStorageFacility;
                  } else if (isToBePickedUp) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.InTransitToStorageFacility;
                  } else if (isInTransitToBuyer) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.Complete;
                  } else if (isInStorageFacility) {
                    productItemStatus =
                      UpdateProductItemStatusDTOStatusEnum.InTransitToBuyer;
                  }

                  updateProductItemStatus.mutate({
                    status: productItemStatus,
                  });
                }
              }}
              disabled={isAcceptDisabled}
            >
              {(isToBePickedUp || isInStorageFacility || isReturnAccepted) && (
                <Text>Accept</Text>
              )}
              {isInTransitToSeller && <Text>Return</Text>}
              {isInTransitToStorageFacility && (
                <Text>Set In Storage Facility</Text>
              )}
              {isInTransitToBuyer && <Text>Complete</Text>}
            </Button>
          </Tooltip>
        )}

        {allowActions && !isCustomer && !isCourier && (
          <HStack spacing='4'>
            <Button onClick={onEditProductItemOpen}>
              <EditIcon />
            </Button>
            <Tooltip
              label='Product items not "IN STORAGE" cannot be deleted'
              hasArrow
              isDisabled={!isInStorage}
            >
              <Button onClick={onDeleteProductItemOpen} disabled={!isInStorage}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          </HStack>
        )}
      </Td>

      <Modal isOpen={isEditProductItemOpen} onClose={onEditProductItemClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditProductItemForm
              productItem={productItem}
              onClose={onEditProductItemClose}
              isRfidOptional={isRfidOptional}
              isCourier={isCourier}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteProductItemOpen}
        onClose={onDeleteProductItemClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this product item? This action
            cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onDeleteProductItemClose}>
              Close
            </Button>
            <Button
              colorScheme='red'
              isLoading={deleteProductItemMutation.isLoading}
              onClick={deleteProductItem}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
