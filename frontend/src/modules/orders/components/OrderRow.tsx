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
import { OrderDTO } from 'generated-api';
import { OrderForm } from './OrderForm';
import Link from 'next/link';
import { Peso } from '../../../shared/components/Peso';
import { OrderStatusBadge } from '../../../shared/components/OrderStatusBadge';

interface OrderRowProps {
  order: OrderDTO;
  incoming: boolean;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, incoming }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tr key={order.id}>
      <Td>
        <Link href={`/orders/${order.id}`}>
          {incoming ? order.fromCompany?.name : order.toCompany?.name}
        </Link>
      </Td>
      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
      <Td>
        <OrderStatusBadge status={order.status} />
      </Td>
      <Td isNumeric>
        <Peso amount={order.total} />
      </Td>
      {incoming && (
        <Td>
          <Button onClick={onOpen}>
            <EditIcon />
          </Button>
        </Td>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderForm order={order} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
