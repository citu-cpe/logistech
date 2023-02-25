import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Td,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { CompanyDTO, CompanyDTOTypeEnum, OrderDTO } from 'generated-api';
import { OrderForm } from './OrderForm';
import Link from 'next/link';
import { Peso } from '../../../shared/components/Peso';
import { OrderStatusBadge } from '../../../shared/components/OrderStatusBadge';
import { useGetStorageFacilityPartners } from '../../storage-facilities/hooks/useGetStorageFacilityPartnersQuery';
import { useGetCouriers } from '../../storage-facilities/hooks/useGetCouriers';

interface OrderRowProps {
  order: OrderDTO;
  allowActions: boolean;
  incoming: boolean;
  company: CompanyDTO;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  allowActions,
  incoming,
  company,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const storageFacilityPartnersQuery = useGetStorageFacilityPartners(
    company.id
  );
  const couriersQuery = useGetCouriers(company.id);

  return (
    <Tr key={order.id}>
      {company.type !== CompanyDTOTypeEnum.StorageFacility && (
        <Td>
          <Link href={`/orders/${order.id}`}>
            {incoming ? order.fromCompany?.name : order.toCompany?.name}
          </Link>
        </Td>
      )}
      {company.type === CompanyDTOTypeEnum.StorageFacility && (
        <>
          <Td>
            <Link href={`/orders/${order.id}`}>{order.fromCompany?.name}</Link>
          </Td>
          <Td>{order.toCompany?.name}</Td>
        </>
      )}
      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
      <Td>
        <OrderStatusBadge status={order.status} />
      </Td>
      <Td>{order.storageFacility?.name}</Td>
      <Td>{order.courier?.username}</Td>
      <Td>{order.dueDate && new Date(order.dueDate).toLocaleDateString()}</Td>
      <Td isNumeric>
        <Peso amount={order.total} />
      </Td>
      {allowActions && (
        <Td>
          <Button onClick={onOpen}>
            <EditIcon />
          </Button>
        </Td>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderForm
              order={order}
              onClose={onClose}
              partnerStorageFacilities={
                company.type !== CompanyDTOTypeEnum.StorageFacility
                  ? storageFacilityPartnersQuery.data?.data
                  : undefined
              }
              couriers={
                company.type === CompanyDTOTypeEnum.StorageFacility
                  ? couriersQuery.data?.data
                  : undefined
              }
              incoming={incoming}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
