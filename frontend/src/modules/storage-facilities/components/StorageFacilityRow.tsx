import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Tr,
  Td,
  Button,
  Tooltip,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { CompanyDTO } from 'generated-api';
import { useAuthStore } from '../../../shared/stores';
import { useAddStorageFacilityPartners } from '../hooks/useAddStorageFacilityPartner';
import { useRemoveStorageFacilityPartner } from '../hooks/useRemoveStorageFacilityPartner';

interface StorageFacilityRowProps {
  storageFacility: CompanyDTO;
  available?: boolean;
}

export const StorageFacilityRow: React.FC<StorageFacilityRowProps> = ({
  storageFacility,
  available,
}) => {
  const { companyId } = useAuthStore();
  const addStorageFacilityPartner = useAddStorageFacilityPartners(companyId!);
  const removeStorageFacilityPartnerQuery = useRemoveStorageFacilityPartner(
    companyId!
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const removeStorageFacilityPartner = () => {
    removeStorageFacilityPartnerQuery.mutate(storageFacility.id, {
      onSettled: () => {
        onClose();
      },
    });
  };

  return (
    <Tr>
      <Td>{storageFacility.name}</Td>
      {available && (
        <Td>
          <Tooltip label={`Partner with ${storageFacility.name}`}>
            <Button
              onClick={() =>
                addStorageFacilityPartner.mutate([storageFacility.id])
              }
              isLoading={addStorageFacilityPartner.isLoading}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Td>
      )}

      {!available && (
        <Td>
          <Tooltip label={`Remove ${storageFacility.name} as partner`}>
            <Button
              onClick={onOpen}
              isLoading={addStorageFacilityPartner.isLoading}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Td>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to remove {storageFacility.name} as a partner?
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme='red'
              isLoading={removeStorageFacilityPartnerQuery.isLoading}
              onClick={removeStorageFacilityPartner}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
