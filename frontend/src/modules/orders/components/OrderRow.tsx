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
import {
  CompanyDTO,
  CompanyDTOTypeEnum,
  OrderDTO,
  OrderDTOStatusEnum,
} from 'generated-api';
import { OrderForm } from './OrderForm';
import Link from 'next/link';
import { Peso } from '../../../shared/components/Peso';
import { OrderStatusBadge } from '../../../shared/components/OrderStatusBadge';
import { useGetStorageFacilityPartners } from '../../storage-facilities/hooks/useGetStorageFacilityPartnersQuery';
import { useGetCouriers } from '../../storage-facilities/hooks/useGetCouriers';
import { PaymentForm } from '../../payments/components/PaymentForm';
import { addLeadingZeros } from '../../../shared/utils/addLeadingZeros';

interface OrderRowProps {
  order: OrderDTO;
  allowEdit: boolean;
  incoming: boolean;
  company: CompanyDTO;
  allowPayment: boolean;
  showTotal: boolean;
  billed?: boolean;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  allowEdit,
  incoming,
  company,
  allowPayment,
  showTotal,
  billed,
}) => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();
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
        <Td>{addLeadingZeros(order.invoiceNumber, 4)}</Td>
      )}

      {(billed === undefined || !billed) && (
        <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
      )}

      {(billed === undefined || !billed) && (
        <Td>
          <OrderStatusBadge status={order.status} />
        </Td>
      )}

      {billed === undefined && <Td>{order.storageFacility?.name}</Td>}

      {billed === undefined ||
        (billed !== undefined && !!billed && (
          <>
            <Td>{order.courier?.username}</Td>
            <Td>
              {order.dueDate && new Date(order.dueDate).toLocaleDateString()}
            </Td>
          </>
        ))}

      {billed === undefined && (
        <Td isNumeric>
          <Peso amount={order.remainingBalance} />
        </Td>
      )}

      {showTotal && (
        <Td isNumeric>
          <Peso amount={order.total + (order.shippingFee ?? 0)} />
        </Td>
      )}

      <Td>
        {allowEdit && (
          <Button onClick={onEditOpen}>
            <EditIcon />
          </Button>
        )}
        {allowPayment && (
          <Button
            onClick={onPaymentOpen}
            disabled={order.status !== OrderDTOStatusEnum.Billed}
          >
            Pay
          </Button>
        )}
      </Td>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderForm
              order={order}
              onClose={onEditClose}
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
              billed={billed}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PaymentForm order={order} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
