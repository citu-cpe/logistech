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
} from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  UpdateProductItemStatusDTOStatusEnum,
} from 'generated-api';
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
}

export const ProductItemRow: React.FC<ProductItemRowProps> = ({
  productItem,
  productId,
  allowActions,
  isCustomer,
  status,
  isCourier,
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
  const deleteProductItemMutation = useDeleteProductItem(productId!);

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

  return (
    <Tr key={productItem.id}>
      <Td>{productItem.rfid}</Td>
      <Td>
        <ProductItemStatusBadge status={productItem.status} />
      </Td>

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
              updateProductItemStatus.mutate({
                status: isReturning
                  ? UpdateProductItemStatusDTOStatusEnum.Returned
                  : isInTransit
                  ? UpdateProductItemStatusDTOStatusEnum.Complete
                  : UpdateProductItemStatusDTOStatusEnum.InTransit,
              });
            }}
          >
            {isReturning ? 'Return' : isInTransit ? 'Complete' : 'Accept'}
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
