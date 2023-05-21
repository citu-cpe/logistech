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
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  UpdateProductItemStatusDTOStatusEnum,
} from 'generated-api';
import { CompanyTypeBadge } from '../../../shared/components/CompanyTypeBadge';
import { ProductItemStatusBadge } from '../../../shared/components/ProductItemStatusBadge';
import { useDeleteProductItem } from '../hooks/useDeleteProductItem';
import { useUpdateProductItemStatus } from '../hooks/useUpdateProductItemStatus';
import { EditProductItemForm } from './EditProductItemForm';

interface ProductItemRowProps {
  productItem: ProductItemDTO;
  productId?: string;
  allowActions?: boolean;
  isCustomer?: boolean;
  status?: ProductItemByStatusDTOStatusEnum;
  isCourier?: boolean;
  isRfidOptional: boolean;
}

export const ProductItemRow: React.FC<ProductItemRowProps> = ({
  productItem,
  allowActions,
  isCustomer,
  status,
  isCourier,
  isRfidOptional,
}) => {
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
  const isReturning = productItem.status === ProductItemDTOStatusEnum.Returning;
  const isInTransit = productItem.status === ProductItemDTOStatusEnum.InTransit;
  const isToBePickedUp =
    productItem.status === ProductItemDTOStatusEnum.ToBePickedUp;

  return (
    <Tr key={productItem.id}>
      <Td>{productItem.rfid ?? 'n/a'}</Td>
      <Td>
        <ProductItemStatusBadge status={productItem.status} />
      </Td>

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

      {isCustomer && status === ProductItemByStatusDTOStatusEnum.Complete && (
        <Td>
          <Button
            isLoading={updateProductItemStatus.isLoading}
            onClick={() => {
              updateProductItemStatus.mutate({
                status: UpdateProductItemStatusDTOStatusEnum.Returning,
              });
            }}
          >
            Return
          </Button>
        </Td>
      )}

      {isCourier && (
        <Td>
          <Button
            isLoading={updateProductItemStatus.isLoading}
            onClick={() => {
              let productItemStatus =
                UpdateProductItemStatusDTOStatusEnum.InTransit;

              if (
                (isToBePickedUp || isReturning) &&
                productItem.product?.company?.type ===
                  CompanyDTOTypeEnum.Retailer
              ) {
                onEditProductItemOpen();
              } else {
                if (isReturning) {
                  productItemStatus =
                    UpdateProductItemStatusDTOStatusEnum.Returned;
                } else if (isInTransit) {
                  productItemStatus =
                    UpdateProductItemStatusDTOStatusEnum.Complete;
                } else if (isToBePickedUp) {
                  productItemStatus =
                    UpdateProductItemStatusDTOStatusEnum.InTransit;
                }

                updateProductItemStatus.mutate({
                  status: productItemStatus,
                });
              }
            }}
          >
            {isReturning && <Text>Return</Text>}
            {isInTransit && <Text>Complete</Text>}
            {isToBePickedUp && <Text>Accept</Text>}
          </Button>
        </Td>
      )}

      {allowActions && !isCustomer && !isCourier && (
        <Td>
          <HStack spacing='4'>
            <Button onClick={onEditProductItemOpen}>
              <EditIcon />
            </Button>
            <Tooltip
              label='Product items not "IN STORAGE" cannot be deleted'
              hasArrow
              isDisabled={
                productItem.status === ProductItemDTOStatusEnum.InStorage
              }
            >
              <Button
                onClick={onDeleteProductItemOpen}
                disabled={
                  productItem.status !== ProductItemDTOStatusEnum.InStorage
                }
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </HStack>
        </Td>
      )}

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
